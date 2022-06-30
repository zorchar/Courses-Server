const concatObjectIdToFieldInDocument = async (Model, documentId, objectId, fieldName) => {
    const document = await Model.findOne({ _id: documentId })

    if (document[fieldName].includes(objectId)) {
        throw { message: 'Error in concatObjectIdToFieldInDocument. ObjectId already in array. Model: ' + Model.modelName + ', documentId: ' + documentId }
    }
    document[fieldName] = document[fieldName].concat(objectId)

    return document
}

const removeObjectIdFromFieldInDocument = async (Model, documentId, objectId, fieldName) => {
    try {
        const document = await Model.findOne({ _id: documentId })

        if (!document[fieldName].includes(objectId))
            throw { message: 'Error in removeObjectIdFromFieldInDocument. ObjectId not in array. Model: ' + Model.modelName + ', documentId: ' + documentId }
        document[fieldName] = document[fieldName].filter(id => id.toString() !== objectId)

        return document
    }
    catch (error) {
        throw error
    }
}

module.exports = {
    concatObjectIdToFieldInDocument,
    removeObjectIdFromFieldInDocument
}