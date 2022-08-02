const patchDocument = async (Model, documentId, data) => {
    try {
        const document = await Model.findById(documentId)

        for (let key in data) {
            if (key != 'userId' && !document._doc[key]) {
                const err = new Error('Request contains invalid fields.')
                err.status = 400
                throw err
            }
        }

        for (let key in data) {
            if (document._doc[key])
                document[key] = data[key]
        }

        return await document.save()

    } catch (error) {
        throw error
    }
}

const deleteDocument = async (Model, documentFilter) => {
    try {
        return await Model.deleteOne(documentFilter)
    } catch (err) {
        throw err
    }
}

const deleteDocuments = async (Model, documentFilter) => {
    try {
        return await Model.deleteMany(documentFilter)
    } catch (err) {
        throw err
    }
}

const concatObjectIdToFieldInDocument = async (Model, documentId, objectId, fieldName) => {
    const document = await Model.findOne({ _id: documentId })

    if (document[fieldName].includes(objectId))
        throw { message: 'Error in concatObjectIdToFieldInDocument. ObjectId already in array. Model: ' + Model.modelName + ', documentId: ' + documentId }

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
    patchDocument,
    deleteDocument,
    deleteDocuments,
    concatObjectIdToFieldInDocument,
    removeObjectIdFromFieldInDocument
}