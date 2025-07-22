import { ok } from "assert";
import { conn } from "../db/db.js";
import axios from "axios";
import fs from 'fs';

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference ,Payment } from 'mercadopago';

export const Acreditarpago = async (req,res) => {
    const content =  JSON.stringify(req.body);    
}      
    
export const ingreso =  (req,res) => {
  const port = process.env.PORT || 3000;
 
  res.status(200).send(`Bienvenido on ${port} ${process.env.VERSION}`)
}

export const getBoleta = async (req,res) => {     
  const { dni,usu,pas } = req.query;
  if (!dni || !usu || !pas) {
    return res.status(400).json({
      ok: false,
      msg: "Faltan datos en la consulta",
    });
  }

  try {
    const [rows] = await conn.query("SELECT * FROM usuarios WHERE estado=0  and (usuario = ? AND pass = ?)", [usu, pas]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario inexistente!" });
    }

    const [result] = await conn.query("SELECT codigo, sede, importe, dni,cliente,status, date_approved, boletaid as id , unit_price, '' as observacion FROM `BoletasCompleto` a, pagos b where a.id = b.boletaid and a.dni = ? and b.status= 'approved'",[dni]);
    if (result.length === 0) {
      return res.status(404).json({ message: `DNI:${dni} no encontrado` });    
    }else{
      return res.status(200).json(result);    
    }

  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }

}

//WEBHOOK
export const receiveWebhook = async (req,res) => {
  let content =  req.query; 
  const dataId = content["data.id"]; // Acceder al valor de "data.id"
  console.log("recibiendo respuesta en webhook")
  console.log(req.body)

  const fecha = new Date();
  const anio = fecha.getFullYear(); 
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
  const dia = String(fecha.getDate()).padStart(2, '0'); 
  const horas = String(fecha.getHours()).padStart(2, '0'); 
  const minutos = String(fecha.getMinutes()).padStart(2, '0'); 
  const segundos = String(fecha.getSeconds()).padStart(2, '0'); 
  
  const date= `${anio}${mes}${dia}${horas}${minutos}${segundos}`;

  // console.log(date)

  const result = await conn.query(
    "INSERT into pagos (  payment, fecha ) values ( ?,? )",
    [dataId,date]
  );
  const { affectedRows, insertId } = result[0];

  if (affectedRows > 0) {
    res.status(200).json({
      ok: true,
      msg: "Succes!",
      Id: insertId,
    });
  } else {
    res.status(500).json({
      ok: false,
      msg: "Failed!",
    });
  }

}

export const generaPagoMercadoPago = async (req,res) => {
  //APP_USR-2402389964183695-032511-8e1ee65a66e2b47c8e7c95b4f94f4ae5-824261165
  const client = new MercadoPagoConfig({ accessToken: `${process.env.API_TOKEN}` });
  console.log(`Ha ingresado al servidor con peticion POST en generaPagoMercadoPago`)
  // console.log(`token: ${process.env.API_TOKEN}`)
  // console.log( `success: ${process.env.back_url}/exito.aspx?id=${req.body.id}` ) 
  // console.log( `failure: ${process.env.back_url}/failure.aspx?id=${req.body.id}` )
  // console.log( `pending: ${process.env.back_url}/pending.aspx?id=${req.body.id}` )
  // console.log( `notificacion_url: ${process.env.notification_url}/webhooks` )
  // console.log(`Bearer ${process.env.API_TOKEN}`)
  console.log(`${process.env.consulta_url}/`)
  
  let content =  JSON.stringify(req.body);   
  console.log(content)
  try {

    const body = {
      items: [
        {
          id: req.body.id,
          title: req.body.title,
          quantity: Number(req.body.quantity),
          description: req.body.description,
          unit_price: Number(req.body.unit_price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: `${process.env.back_url}/success?id=${req.body.id}`,
        failure: `${process.env.back_url}/failure?id=${req.body.id}`,
        pending: `${process.env.back_url}/pending?id=${req.body.id}`,
      },
      payment_methods :{
          installments:1 
      },
      notificacion_url: `${process.env.notification_url}/webhooks`,
      auto_return: "approved",
      payer: {
        name: req.body.name,
        email: req.body.email,
      },
      identification :{
        type: "DNI",
        number: req.body.identification,  
      },
      expires: true,
      expiration_date_from: getExpirationDateFrom(),
      date_of_expiration: getExpirationDateTo(),
      expires: true,
      expiration_date_from: getExpirationDateFrom(),
      date_of_expiration: getExpirationDateTo(),
    };
    const preference = new Preference(client)
    const result = await preference.create({body})
    const { client_id,collector_id,id, operation_type,date_created,date_of_expiration } = result;
    console.log(result)
    // const insertdata = await conn.query(
    //   "INSERT into log_create_preference ( client_id,preference_id,id,operation_type,date_created,date_of_expiraton,nombre,email,nrodoc,boleta  ) values ( ?, ?, ?, ?, ?, ?,?,?,?,?)",
    //   [client_id,collector_id,id, operation_type,date_created,date_of_expiration,req.body.name,req.body.email,req.body.identification,req.body.id]
    // );
    // const { affectedRows } = insertdata[0];

    // if (affectedRows == 1) {  
    //   console.log("se inserto el log correctamente")
    // }	

    return res.status(200).json( {
      id: result.id,
      init_point: result.init_point

    });    
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: "Error al crear la preferencia"
    })
  }

}

function getExpirationDateTo() {
  let now = new Date();
  now.setDate(now.getDate() + 3); // Sumar 3 días
  return now.toISOString(); // Convertir a formato ISO 8601
}

function getExpirationDateFrom() {
  let now = new Date();
  now.setDate(now.getDate()); 
  return now.toISOString(); // Convertir a formato ISO 8601
}

async function fetchPaymentData(paymentId) {
  try {
    const response = await axios.get(`${process.env.consulta_url}/${paymentId}`, {
      headers: {
        Authorization:`Bearer ${process.env.API_TOKEN}` 
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error al obtener los datos desde api mercadopago:${paymentId}`, error.message);
    throw error;
  }
}

async function fetchPaymentIds() {
  try {
    'OJO sacar pending al finalizar'
    const [results] = await conn.query("SELECT id, payment, status FROM pagos WHERE (status not in ('approved','cancelled','rejected','refunded','pending') or status is null) order by id desc");
    return results;
  } catch (err) {
    throw err;
  }
}

function updatePaymentStatus(paymentId, status) {
  const query = 'UPDATE pagos SET date_approved=?,payment_type_id=?,status=? WHERE payment = ?';
  conn.query(query, [status, paymentId], (err) => {
    if (err) {
      console.error('Error al actualizar el estado del pago:', err.message);
    } else {
      console.log(`Estado del pago ${paymentId} actualizado a ${status}`);
    }
  });
}

async function savePaymentDataToDatabase(paymentData, id_pago) {
        let p0 = "";
        let p1 = "";
        let p2 = "";  
        let p3 = "";
        let p4 = "";  
        let p5 = "";
        let p6 = "";
        let p7 = "";
        let p8 = "";
        let p9 = "";
         try {
            p0 = JSON.stringify(paymentData);
            p1 = paymentData?.date_approved ?? "";
            p2 = paymentData?.payment_type_id ?? "";
            p3 = paymentData?.status ?? "";

          if (
            paymentData.additional_info &&
            Array.isArray(paymentData.additional_info.items)
          ) {
            paymentData.additional_info.items.forEach((item) => {
              console.log(
                `${paymentData.id}   ID: ${item.id}, Título: ${item.title} , Precio: ${item.unit_price}`
              );
              p4 = item.title;
              p5 = item.id;
              p6 = item.unit_price;
            });
          }

            p7 = paymentData.payer?.email ?? "";
            p8 =  paymentData.payer?.identification?.type ?? "";
            p9 =  paymentData.payer?.identification?.number ?? "";

           const sql =
             "UPDATE pagos SET estado_json=?, date_approved=?,payment_type_id=?,status=?,title=?,boletaid=?,unit_price=?,email=?,id_type=?,id_number=? WHERE id = ?";
             const values = [p0,p1, p2, p3, p4, p5, p6, p7, p8, p9, id_pago];
             try {
              const [result] = await conn.query(sql, values);
             } catch (error) {
              console.log(error.message)
             }
         } catch (err) {
         console.log("Error al actualizar el registro:", err);
       }
}

export const processPagos = async (req,res) => {
  try {
    // se trae todos los registros de la tabla pagos
    console.log(`Procesando pagos...`);    
    const payments = await fetchPaymentIds();
    console.log(`Se encontraron ${payments.length} registros.`);

    let contador = 0;
    for (const registro of payments) {
      const paymentId = registro.payment; // Valor de la columna `payment`
      const id = registro.id; // Valor de la columna `id`
        
       try {
         const paymentData = await fetchPaymentData(paymentId);
           
         savePaymentDataToDatabase(paymentData, id);

         contador++;
         if (contador % 50 === 0) {
           console.log(`Se leyeron ${contador} registros.`);
         }
  
       } catch (error) {
         console.log(
           `Error al procesar paymentId ${paymentId}:`,
           error.message
         );
       }
     }

     console.log(`Proceso completado. ${contador} registros procesados.`);

     res.status(201).json({
      ok: true,
      msg: "Succes!",
      registrosProcesados: contador,
    });     

  } catch (error) {
    console.error('No se pudo completar el proceso: ', error.message);
  }
}
