// Arquivo de configuração do multer
const multer = require("multer");
const path = require("path");

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        cb(null, "uploads/") //Diretório onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const uniqueSufix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSufix + path.extname(file.originalname)); //Garante nomes únicos
    }
});

//Filtro para aceitar somente imagens
const fileFilter = (req,file,cb) =>{
    // Verifica o tipo do arquivo
    if(file.mimetype.startsWith('image/')){
        cb(null,true); // Aceita o arquivos
    } else {
        cb(new Error('Este tipo de arquivo não é suportado'), false); //Rejeita o arquivo
    }
};

// Configuração do multer
const upload = multer({
    storage:storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por arquivo
});

module.exports = upload;