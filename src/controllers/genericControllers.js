const patchDocument = async (Model, documentId, data) => {
    try {
        const document = await Model.findById(documentId)
        for (let key in data) {
            if (document._doc[key])
                document[key] = data[key]
        }
        await document.save()
        return document
    } catch (error) {
        throw error
    }
}

const deleteDocument = async (Model, documentFilter) => {
    try {
        return await Model.deleteOne(documentFilter)
    } catch (error) {
        throw error
    }
}

module.exports = {
    patchDocument,
    deleteDocument
}