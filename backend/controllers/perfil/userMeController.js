const userMeModel = require('../../models/perfil/userMeModel')
const asyncHandler = require('../../utils/asyncHandler')

const userMe = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await userMeModel(userId);

    res.status(200).json(user);
});

module.exports = userMe;