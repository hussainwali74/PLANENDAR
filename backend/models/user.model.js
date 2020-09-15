export default (sequelize, DatatTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
        timestamps: true

    });

    User.associate = (models) => {
        // 1 to many with board
        User.hasMany(models.B)
    }

}