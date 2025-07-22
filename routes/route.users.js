import { Router } from "express";
import { ingreso,receiveWebhook, generaPagoMercadoPago, Acreditarpago,getBoleta,processPagos } from "../controllers/controller.users.js";

const router = Router()

router.get('/', ingreso);
router.post("/create_preference", generaPagoMercadoPago)
router.post("/webhooks", receiveWebhook)
router.get("/success", (req , res) => res.json( req.query ) )
router.get("/failure", (req , res) => res.json( req.query ) )
router.get("/pending", (req , res) => res.send("pending") )
router.post('/checkfile', Acreditarpago)
router.get("/consultaboleta", getBoleta )
router.get("/updatepagos", processPagos )


export default router