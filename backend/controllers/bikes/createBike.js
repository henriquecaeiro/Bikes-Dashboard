const { response } = require('express');
const db = require('../../config/db');

module.exports = async (req, res) => {
    const connection = await db.getConnection(); // Obtém uma conexão da pool

    const datetime = new Date();

    try {

        const { model, sellingPrice, year, mileage, seller, status, buyer, purchasePrice } = req.body;

        const photos = req.files.filter(file => file.fieldname === 'photos');

        const documents = req.files.filter(file => file.fieldname === 'documents');

        if (!model || !sellingPrice || !year || !mileage || !seller || !status || !buyer || !purchasePrice) {
            //Retorna erro 400 se algum dado obrigatório faltar
            return res.status(400).json({ error: 'Modelo, preço de venda, ano, quilometragem, vendedor, status, comprador, e preço de compra são obrigatórios ' });
        }

        //Buscando o id do vendedor pelo nome
        const [sellerRows] = await db.query('SELECT id FROM users WHERE name = ?', [seller]);

        //Verificar se o vendedor existe
        if (sellerRows.length === 0) {
            return res.status(404).json({ error: 'Vendedor não encontrado.' });
        }

        const sellerId = sellerRows[0].id;

        //Buscando o id do comprador 
        const [buyerRows] = await db.query('SELECT id FROM users WHERE name = ?', [buyer]);

        //Verificando se o comprador existe
        if (buyerRows.length === 0) {
            return res.status(404).json({ error: 'Comprador não encontrado.' });
        }

        const buyerId = buyerRows[0].id;

        await connection.beginTransaction(); //Inicia a transação

        // Inserção na tabela `bikes`
        const [bikeResult] = await connection.query('INSERT INTO bikes (model, year, mileage, selling_price, seller_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [model, year, mileage, sellingPrice, sellerId, status, datetime]);

        const bikeId = bikeResult.insertId //Recupera o id 

        // Insere na tabela `bike_buyers`
        await connection.query('INSERT INTO bike_buyers (bike_id, buyer_id, purchase_price) VALUES (?, ?, ?)', [bikeId, buyerId, purchasePrice]);

        // Verifica se existe alguma foto ou documento inserido
        if (photos.length > 0 || documents.length > 0) {
           
            const queries = []; // Armazena todas as queries para executar em lote
        
            //Processa as fotos e os documentos
            photos.forEach(photo => {
                queries.push(
                    connection.query(
                        'INSERT INTO bike_photos (bike_id, photo_url, uploaded_at) VALUES (?, ?, ?)',
                        [bikeId, photo.path, datetime]
                    )
                );
            });
        
            documents.forEach(document => {
                queries.push(
                    connection.query(
                        'INSERT INTO bike_documents (bike_id, document_url, uploaded_at) VALUES (?, ?, ?)',
                        [bikeId, document.path, datetime]
                    )
                );
            });
        
            await Promise.all(queries); // Executa as queries
        }

        await connection.commit(); //confirma a transação

        res.status(201).json({
            message: 'Moto criada com sucesso'
        });

    } catch (error) {
        if (connection) await connection.rollback(); //Reverte a transação em caso de erro
        res.status(500).json({
            error: error.message
        })
    } finally {
        connection.release();
    }
};