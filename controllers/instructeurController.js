const Instructeur = require('../models/instructeurModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const dbConnection = require('../config/db');
const { generateToken, authenticateToken } = require('../middleware/authMiddleware'); // Ajout des importations

const saltRounds = 10;
const query = util.promisify(dbConnection.query).bind(dbConnection);

const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
};

const validateFields = (req, res) => {
    const { nom, prenom, email, tel, specialite, mots_de_passe } = req.body;
    if (!nom || !prenom || !email || !tel || !specialite || !mots_de_passe) {
        return res.status(400).json({ message: 'Tous les champs sont requis pour ajouter un instructeur.' });
    }
    return true;
};

const listerInstructeurs = async (req, res) => {
    try {
        const results = await query('SELECT * FROM instructeur');
        return res.status(200).json({ success: true, liste: results });
    } catch (err) {
        return errorHandler(res, err);
    }
};



const modifierInstructeur = async (req, res) => {
    try {
        const { id: instructeurId } = req.params;
        const { nom, prenom, email, tel, specialite, role, userId } = req.body;

        if (instructeurId !== userId) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cet instructeur.' });
        }

        if (!id || !validateFields(req, res)) {
            return res.status(400).json({ message: 'ID et tous les champs sont requis pour modifier un instructeur.' });
        }

        // Vérifiez si l'ID de l'instructeur correspond à celui de l'utilisateur authentifié
        if (id !== instructeurId) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cet instructeur.' });
        }

        const hashedmots_de_passe = await bcrypt.hash(mots_de_passe, saltRounds);

        const updateQuery = `
            UPDATE instructeur
            SET nom = ?, prenom = ?, email = ?, tel = ?, specialite = ?, role = ?
            WHERE instructeurId = ?
        `;

        const result = await query(updateQuery, [nom, prenom, email, tel, specialite, role, id]);

        return res.status(200).json({
            message: 'Instructeur modifié avec succès.',
            instructeur: result
        });
    } catch (err) {
        return errorHandler(res, err);
    }
};

const register = async (req, res) => {
    const instructeurData = req.body;

    try {
        const result = await Instructeur.register(instructeurData);
        res.status(201).json({ success: true, message: 'Inscription réussie.', result });
    } catch (error) {
        errorHandler(res, 'Erreur lors de l\'inscription: ' + error.message);
    }
};

const login = async (req, res) => {
    const { email, mots_de_passe } = req.body;

    try {
        const user = await Instructeur.login(email, mots_de_passe);

        if (user) {
            const token = generateToken(user.id); // Utilisez la fonction importée d'authMiddleware

            // Envoyez le token JWT dans l'en-tête de la réponse HTTP
            res.header('Authorization', `Bearer ${token}`);

            res.status(200).json({ success: true, message: 'Connexion réussie.', user, token });
        } else {
            res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect. participant ' });
        }
    } catch (error) {
        errorHandler(res, 'Erreur lors de la connexion: ' + error.message);
    }
};




const supprimerInstructeur = async (req, res) => {
    try {
        const { id } = req.params;

        authenticateToken(req, res, async () => {
            const userRole = req.user.role;  

            // Ensure the user has the required role
            if (userRole !== 'instructeur') {
                return res.status(403).json({ message: 'Permission denied. Insufficient role.' });
            }

            if (!id) {
                return res.status(400).json({ message: 'ID requis pour supprimer un instructeur.' });
            }

            const deleteQuery = 'DELETE FROM instructeur WHERE id = ?';

            const result = await query(deleteQuery, [id]);

            return res.status(200).json({ message: 'Instructeur supprimé avec succès.', result });
        });
    } catch (err) {
        return errorHandler(res, err);
    }
};
    

const getInstructeurById = async (req, res) => {
    try {
        const { id } = req.params;
        const instructeurData = await Instructeur.getInstructeurById(id);
        if (instructeurData) {
            res.status(200).json({ success: true, Instructeur: instructeurData });
        } else {
            res.status(404).json({ success: false, message: 'Instructeur non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du participant par ID:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la récupération du participant.' });
    }
};

module.exports = {
    listerInstructeurs,
    getInstructeurById,
    modifierInstructeur,
    supprimerInstructeur,
    register,
    login
};
