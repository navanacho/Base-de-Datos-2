const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    phone: String,
    role: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
}, { timestamps: true });

//hashear la contrseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

//método para comparar contraseñas
module.exports = mongoose.model('User', userSchema);