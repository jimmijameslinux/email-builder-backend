const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const EmailTemplate = require('../models/EmailTemplate');


// API to get email layout
router.get('/getEmailLayout', (req, res) => {
    const filePath = "E:/Email_builder/email-builder-backend/layout.html"
    if (fs.existsSync(filePath)) {
        const layout = fs.readFileSync(filePath, 'utf-8');
        res.send(layout);
    } else {
        res.status(404).json({ error: 'Layout file not found' });
    }
});


// API route to handle image uploads
router.post('/uploadImage', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});


// Save template to database and generate renderedOutput.html
router.post('/uploadEmailConfig', async (req, res) => {
    try {
        // Save template data in the database
        const template = new EmailTemplate(req.body);
        await template.save();

        // Generate rendered HTML
        const { title, content, footer, imageUrl } = req.body;
        const outputHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>
        <div class="container mt-4">
          <div class="card shadow-sm">
            <div class="card-header text-center bg-primary text-white">
              <img src="${imageUrl}" class="img-fluid" alt="Email Header" />
            </div>
          </div>
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
                <p class="card-text">${content}</p>
                <footer class="blockquote blockquote-footer text-center">
                ${footer}
                </footer>
            </div>
        </div>
      </body>
      </html>
    `;

        // Save the rendered HTML as renderedOutput.html
        const outputPath = path.join(__dirname, '../renderedOutput.html');
        fs.writeFileSync(outputPath, outputHtml);

        res.send({ message: 'Template saved and rendered output generated!' });
    } catch (error) {
        console.error('Error saving template:', error);
        res.status(500).send({ message: 'Error saving template.' });
    }
});

router.post('/renderAndDownloadTemplate', (req, res) => {
    const { layout, data } = req.body;
    const filledTemplate = layout.replace(/\{\{(.*?)\}\}/g, (_, key) => data[key.trim()] || '');
    res.setHeader('Content-disposition', 'attachment; filename=template.html');
    res.send(filledTemplate);
});

module.exports = router;
