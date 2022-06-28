const concatObjectIdToFieldInDocument = async (Model, documentId, objectId, fieldName) => {
    const document = await Model.findOne({ _id: documentId })

    if (document[fieldName].includes(objectId))
        throw { message: 'ObjectId already in array.' }
    document[fieldName] = document[fieldName].concat(objectId)

    return document
}

module.exports = {
    concatObjectIdToFieldInDocument
}