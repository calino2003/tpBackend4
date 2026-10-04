import { Router } from 'express';
import { crearCompania, obtenerCompanias, obtenerCompaniaPorId, actualizarCompania, eliminarCompania } from '../controllers/companias.controller.mjs';

const router = Router();

router.post('/', crearCompania);
router.get('/', obtenerCompanias);
router.get('/:id', obtenerCompaniaPorId);
router.put('/:id', actualizarCompania);
router.delete('/:id', eliminarCompania);

export default router;