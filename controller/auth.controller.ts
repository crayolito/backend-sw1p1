import { Request, Response } from "express";
import { pool } from "../database/config";

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos' });
    }
    try {
        const consultaExistencia = (await pool.query('SELECT * FROM usuario WHERE email = $1', [email]));
        if (consultaExistencia.rowCount! > 0) {
            // EL USUARIO EXISTE
            console.log('La consulta se realizó correctamente');
            const { email: emailBD, password: passwordBD } = consultaExistencia.rows[0];
            if (!(email == emailBD && passwordBD == password)) {
                return res.status(400).json({ ok: false, mensaje: 'El usuario no existe o la contraseña es incorrecta' });
            }
            res.json({
                email,
                password,
                ok: true,
            });
        } else {
            // EL USUARIO NO EXISTE
            console.log('La consulta no afectó a ninguna fila');
            res.status(409).json({ ok: false, mensaje: 'Este usuario no existe REGISTRE!!!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, mensaje: 'Error en consulta BD' });
    }
}

export const registre = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos' });
    }

    try {
        const consultaExistencia = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (consultaExistencia.rows[0]) {
            return res.status(400).json({ ok: false, mensaje: 'El usuario ya existe' });
        }
        const creacionUser = await pool.query('INSERT INTO usuario (email, password) VALUES ($1, $2)', [email, password]);
        if (creacionUser.rowCount! > 0) {
            console.log('La consulta se realizó correctamente');
            res.json({
                email,
                password,
                ok: true,
            });
        } else {
            console.log('La consulta no afectó a ninguna fila');
            res.status(409).json({ ok: false, mensaje: 'Error en la creacion del usuario' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, mensaje: 'Error en consulta BD' });
    }
}