const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendContactEmail = async (req, res) => {
  try {
    const {
      name,
      email,
      date,
      phone,
      address,
      selectedPackage,
      details,
      source = 'Formulario de inicio',
      eventType,
      guestCount,
      startTime,
      endTime,
      venueType,
      preferredContact,
      inspiration,
      budget,
    } = req.body || {};

    if (!name || !email || !selectedPackage) {
      return res.status(400).send({
        message: 'Name, email, and selected package are required',
      });
    }

    const emailHtml = `
      <h2>Nueva solicitud de contacto</h2>

      <p><strong>Origen:</strong> ${source}</p>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Fecha del evento:</strong> ${date || 'No especificada'}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
      <p><strong>Dirección:</strong> ${address || 'No especificada'}</p>
      <p><strong>Paquete de interés:</strong> ${selectedPackage}</p>

      <h3>Información adicional</h3>
      <p><strong>Tipo de evento:</strong> ${eventType || 'No especificado'}</p>
      <p><strong>Número de invitados:</strong> ${guestCount || 'No especificado'}</p>
      <p><strong>Hora de inicio:</strong> ${startTime || 'No especificada'}</p>
      <p><strong>Hora de fin:</strong> ${endTime || 'No especificada'}</p>
      <p><strong>Tipo de lugar:</strong> ${venueType || 'No especificado'}</p>
      <p><strong>Contacto preferido:</strong> ${preferredContact || 'No especificado'}</p>
      <p><strong>Presupuesto aproximado:</strong> ${budget || 'No especificado'}</p>

      <h3>Inspiración / estilo deseado</h3>
      <p>${inspiration || 'No especificado'}</p>

      <h3>Detalles del evento</h3>
      <p>${details || 'Sin detalles adicionales'}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM,
      to: process.env.CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `Nueva solicitud: ${selectedPackage}`,
      html: emailHtml,
    });

    if (error) {
      return res.status(400).send({
        message: error.message,
      });
    }

    return res.status(200).send({
      message: 'Contact email sent successfully',
      id: data.id,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  sendContactEmail,
};
