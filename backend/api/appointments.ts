import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../config/database';
import { Appointment } from '../models/Appointment';
import { Coupon } from '../models/Coupon';
import { sendEmail, getBookingConfirmationEmail, getAdminNotificationEmail } from '../services/emailService';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  await connectDB();

  try {
    if (req.method === 'GET') {
      const appointments = await Appointment.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        data: appointments,
      });
    } else if (req.method === 'POST') {
      const appointmentData = req.body;

      // Validate required fields including new address fields
      const requiredFields = [
        'fullName',
        'email',
        'phone',
        'streetAddress',
        'city',
        'state',
        'zipCode',
        'make',
        'vehicleModel',
        'year',
        'serviceType',
        'vehicleCategory',
        'date',
        'timeSlot',
      ];

      const missingFields = requiredFields.filter(field => !appointmentData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }

      // Process coupons if provided
      let processedCoupons: any[] = [];
      let totalDiscount = 0;
      let finalPrice = appointmentData.basePrice || appointmentData.totalPrice;

      if (appointmentData.coupons && Array.isArray(appointmentData.coupons) && appointmentData.coupons.length > 0) {
        const now = new Date();
        const basePrice = appointmentData.basePrice || appointmentData.totalPrice;

        for (const couponData of appointmentData.coupons) {
          const coupon = await Coupon.findOne({ 
            code: couponData.code,
            isActive: true,
            expiryDate: { $gt: now }
          });

          if (coupon) {
            const discountAmount = (basePrice * coupon.discountPercentage) / 100;
            totalDiscount += discountAmount;

            processedCoupons.push({
              code: coupon.code,
              discountPercentage: coupon.discountPercentage,
              discountAmount: discountAmount,
            });
          }
        }

        finalPrice = Math.max(0, basePrice - totalDiscount);
      }

      // Build full address from components for backward compatibility
      const fullAddress = [
        appointmentData.streetAddress,
        appointmentData.aptUnit ? `Apt/Unit: ${appointmentData.aptUnit}` : '',
        appointmentData.city,
        appointmentData.state,
        appointmentData.zipCode
      ].filter(Boolean).join(', ');

      // Generate vehicleName if not provided
      const vehicleName = appointmentData.vehicleName || 
        `${appointmentData.make} ${appointmentData.vehicleModel}`;

      const appointmentToSave = {
        // Customer info
        fullName: appointmentData.fullName,
        phone: appointmentData.phone,
        email: appointmentData.email,
        
        // Address fields (new)
        streetAddress: appointmentData.streetAddress,
        aptUnit: appointmentData.aptUnit || '',
        city: appointmentData.city,
        state: appointmentData.state,
        zipCode: appointmentData.zipCode,
        address: fullAddress, // Legacy field for backward compatibility
        
        // Vehicle info (simplified - make, model, year only)
        vehicleName: vehicleName,
        make: appointmentData.make,
        vehicleModel: appointmentData.vehicleModel,
        year: appointmentData.year,
        
        // Service info
        serviceType: appointmentData.serviceType,
        vehicleCategory: appointmentData.vehicleCategory,
        date: appointmentData.date,
        timeSlot: appointmentData.timeSlot,
        
        // Pricing
        basePrice: appointmentData.basePrice || appointmentData.totalPrice,
        coupons: processedCoupons,
        totalDiscount: totalDiscount,
        totalPrice: finalPrice,
        discountApplied: processedCoupons.length > 0,
        
        // Status
        status: appointmentData.status || 'Pending',
      };

      const appointment = new Appointment(appointmentToSave);
      await appointment.save();

      // Send confirmation emails
      try {
        const couponCodes = processedCoupons.map(c => c.code).join(', ');
        
        // Customer confirmation email
        await sendEmail({
          to: appointmentData.email,
          subject: 'Global Integrated Support - Appointment Confirmation',
          html: getBookingConfirmationEmail({
            fullName: appointmentData.fullName,
            serviceType: appointmentData.serviceType,
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            totalPrice: finalPrice,
            basePrice: appointmentToSave.basePrice,
            discount: totalDiscount,
            coupons: couponCodes || 'None',
            // Include address info in email
            streetAddress: appointmentData.streetAddress,
            aptUnit: appointmentData.aptUnit,
            city: appointmentData.city,
            state: appointmentData.state,
            zipCode: appointmentData.zipCode,
            // Vehicle info
            vehicleName: vehicleName,
            make: appointmentData.make,
            vehicleModel: appointmentData.vehicleModel,
            year: appointmentData.year,
          } as any),
        });

        // Admin notification email
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'info@vornoxlab.com',
          subject: 'New Booking - Global Integrated Support',
          html: getAdminNotificationEmail({
            fullName: appointmentData.fullName,
            phone: appointmentData.phone,
            email: appointmentData.email,
            serviceType: appointmentData.serviceType,
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            vehicleName: vehicleName,
            totalPrice: finalPrice,
            // Include full address details
            streetAddress: appointmentData.streetAddress,
            aptUnit: appointmentData.aptUnit,
            city: appointmentData.city,
            state: appointmentData.state,
            zipCode: appointmentData.zipCode,
            make: appointmentData.make,
            vehicleModel: appointmentData.vehicleModel,
            year: appointmentData.year,
          }),
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails
      }

      return res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment,
      });
    } else if (req.method === 'PUT') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment ID',
        });
      }

      const updateData = req.body;
      
      // If address fields are being updated, regenerate the full address
      if (updateData.streetAddress || updateData.city || updateData.state || updateData.zipCode) {
        const currentAppointment = await Appointment.findById(id);
        if (currentAppointment) {
          const fullAddress = [
            updateData.streetAddress || currentAppointment.streetAddress,
            updateData.aptUnit || currentAppointment.aptUnit ? `Apt/Unit: ${updateData.aptUnit || currentAppointment.aptUnit}` : '',
            updateData.city || currentAppointment.city,
            updateData.state || currentAppointment.state,
            updateData.zipCode || currentAppointment.zipCode
          ].filter(Boolean).join(', ');
          updateData.address = fullAddress;
        }
      }

      // If vehicle fields are being updated, regenerate vehicleName
      if (updateData.make || updateData.vehicleModel) {
        const currentAppointment = await Appointment.findById(id);
        if (currentAppointment) {
          updateData.vehicleName = `${updateData.make || currentAppointment.make} ${updateData.vehicleModel || currentAppointment.vehicleModel}`;
        }
      }

      const appointment = await Appointment.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment,
      });
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment ID',
        });
      }

      const appointment = await Appointment.findByIdAndDelete(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } else {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed',
      });
    }
  } catch (error) {
    console.error('Appointments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
