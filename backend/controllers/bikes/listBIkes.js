const {response} = require('express');
const db = require('../../config/db')

module.exports = async (req, res) => {
    const connection = await db.getConnection();

    try {
        
    const { model, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage, status, seller } = req.query;

    // Querie base
    let query = 'SELECT * FROM bikes WHERE 1=1';

    // Array para armazenar a queries
    const params = [];

    if(model){
        query += ' AND model LIKE ?';
        params.push(`%${model}%`);
    }

    if(minYear){
        query += ' AND year >= ?';
        params.push(minYear);
    }

    if(maxYear){
        query += ' AND year <= ?';
        params.push(maxYear);
    }

    if(minMileage){
        query += ' AND mileage >= ?';
        params.push(minMileage);
    }

    if(maxMileage){
        query += ' AND mileage <= ?';
        params.push(maxMileage);
    }

    if(minPrice){
        query += ' AND selling_price >= ?';
        params.push(minPrice);
    }

    if(maxPrice){
        query += ' AND selling_price <= ?';
        params.push(maxPrice);
    }

    if(seller){
        query += 'AND seller = ?'
        params.push(seller);
    }

    if(status){
        query += 'AND status = ?'
        params.push(status)
    }


    const [rows] = await db.query(query, params);

    res.status(200).json({filter: rows});

    } catch (error) {
        res.status(500).json({error: error.message})
    } finally{
        connection.release(); //Libera a conexão
    }
}