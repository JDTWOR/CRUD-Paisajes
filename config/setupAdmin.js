const Usuario = require('../models/usuarioModel');

const createAdminUser = async () => {
    try {
        const adminExists = await Usuario.findOne({ username: 'admin' });
        if (!adminExists) {
            await Usuario.create({
                username: 'admin',
                password: '123',
                role: 'admin'
            });
            console.log('Usuario admin creado correctamente');
        }
    } catch (error) {
        console.error('Error al crear usuario admin:', error);
    }
};

module.exports = createAdminUser;