// coursPModel.js
const db = require('../config/db');
const express = require('express');

const app = express();
const util = require('util');

const query = util.promisify(db.query).bind(db);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const createcours = async (coursData) => {
    try {
        const { titre, description,  contenu } = coursData;
        const query = 'INSERT INTO courgratuits (titre, description, contenu) VALUES (?, ?,?)';
        const result = await db.query(query, [titre	, description, contenu]);
        return result;
    } catch (error) {
        throw new Error('Erreur lors de la création de la cours dans la base de données');
    }
};
const getcoursById = async (id_cg) => {
    try {
        const results = await query('SELECT * FROM courgratuits WHERE id_cg = ?', [id_cg]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
};




const getAllcourss = () => {
    const query = 'SELECT * FROM courgratuits';
    return db.query(query);
};

const updatecours = (id_cg, titre, description, contenu) => {
    const query = 'UPDATE courgratuits SET titre = ?, description = ?, contenu = ? WHERE id_cg = ?';
    return db.query(query, [titre, description, contenu, id_cg]);
};


const deletecours = (id_cg) => {
    const query = 'DELETE FROM courgratuits WHERE id_cg= ?';
    return db.query(query, [id_cg]);
};

const searchcourssByTitre = (titre) => {
    const query = 'SELECT * FROM courgratuits WHERE titre LIKE ?';
    const searchPattern = `%${titre}%`;
    return db.query(query, [searchPattern]);
};

const countCours = async () => {
    try {
        const results = await query('SELECT COUNT(*) AS total FROM courgratuits');
        return results[0].total;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createcours,
    getAllcourss,
    updatecours,
    deletecours,
    searchcourssByTitre,
    getcoursById , 
    countCours
};
