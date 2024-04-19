const express = require('express');
const router = express.Router();
const formationController = require('../controllers/FormationPController');
const { authenticateToken, generateToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/fileapp")

router.post('/ajouter',upload.any('plant'),formationController.createFormation);

router.get('/lister', formationController.getAllFormations);
router.put('/modifier/:id', formationController.updateFormation);
router.delete('/supprimer/:id', formationController.deleteFormation);
router.get('/rechercher', formationController.searchFormationsByTitre);
router.get('/getFormationById/:id', formationController.getFormationById);
router.get('/searchByDomaine', formationController.searchFormationsByDomaine);
router.get('/count', formationController.getFormationCount);
router.get('/countDistinctDomains', formationController.countDistinctDomains);  
router.get('/getNumberOfCertificats', formationController.getNumberOfCertificats);  

// Route pour récupérer le nombre de formations par domaine
router.get('/countFormationsByDomain', formationController.countFormationsByDomain);
router.put('/accepter/:id_fp', formationController.acceptFormation);
router.put('/refuser/:id_fp', formationController.rejectFormation);
module.exports = router;