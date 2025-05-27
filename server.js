const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dekoronlineservices@gmail.com',
        pass: 'kxos rgbw izno gqlx'
    }
});

app.post('/shop/order', (req, res) => {
    console.log(req.body);

    const { name, address, city, postalCode, phone, email, cart } = req.body;

    if (!name || !address || !city || !postalCode || !phone || !email || cart.length === 0) {
        return res.status(400).json({ message: 'Sva polja su obavezna!' });
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const orderDetails = cart.map(item => `
        <tr style="border-bottom: 1px solid #ddd; padding: 10px;">
            <td style="padding: 10px;">
                <img src="${item.imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 5px;">
            </td>
            <td style="padding: 10px; text-align: left;">
                ${item.name}
            </td>
            <td style="padding: 10px; text-align: center;">
                ${item.quantity}x
            </td>
            <td style="padding: 10px; text-align: right;">
                ${item.price * item.quantity} RSD
            </td>
        </tr>
    `).join('');

    const emailContent = `
        <div style="background-color: #f4f4f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://www.dekorcompany.rs/assets/images/logo.png" alt="Dekor Company" style="width: 150px; height: auto;">
                </div>
                <h2 style="text-align: center; color: #333;">Hvala na narudžbini!</h2>
                <p style="font-size: 16px; color: #555;">Poštovani ${name},</p>
                <p style="font-size: 16px; color: #555;">Vaša narudžbina je uspešno primljena. Molimo Vas da proverite podatke ispod:</p>
                <div style="background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <p><strong>Ime:</strong> ${name}</p>
                    <p><strong>Adresa:</strong> ${address}, ${city}, ${postalCode}</p>
                    <p><strong>Telefon:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                </div>
                <h3 style="color: #333;">Detalji narudžbine:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tbody>${orderDetails}</tbody>
                </table>
                <div style="margin-top: 20px; text-align: right;">
                    <p style="font-size: 18px; color: #333;"><strong>Ukupna cena: ${total} RSD</strong></p>
                </div>
                <div style="border-top: 2px solid #ddd; margin-top: 20px; padding-top: 20px; text-align: center;">
                    <p style="font-size: 14px; color: #777;">Ukoliko imate bilo kakvih pitanja, slobodno nas kontaktirajte:</p>
                    <p style="font-size: 14px; color: #555;">
                        <strong>Telefon:</strong> +381 033 445723<br>
                        <strong>Email:</strong> <a href="mailto:office@dekorcompany.rs" style="color: #1a73e8;">office@dekorcompany.rs</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    const mailOptionsCustomer = {
        from: 'dekoronlineservices@gmail.com',
        to: email,
        subject: 'Potvrda narudžbine',
        html: emailContent
    };

    const mailOptionsAdmin = {
        from: 'dekoronlineservices@gmail.com',
        to: 'bzloapasta@gmail.com',
        subject: 'Nova narudžbina',
        html: emailContent
    };

    transporter.sendMail(mailOptionsCustomer, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Greška pri slanju emaila kupcu.' });
        }
        transporter.sendMail(mailOptionsAdmin, (adminError, adminInfo) => {
            if (adminError) {
                return res.status(500).json({ message: 'Greška pri slanju emaila administratoru.' });
            }
            res.json({ message: 'Narudžbina uspešno poslata kupcu i administratoru!' });
        });
    });
});

app.listen(3000, () => console.log('Server pokrenut na portu 3000'));
