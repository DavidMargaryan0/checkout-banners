import model from "./model";

export async function createBanner(data) {
    await ensureOneActive(data)
    return model.create(data)
}

export async function fetchBanners() {
    return model.find({})
}

export async function fetchBanner(id) {
    return model.findById(id)
}

export async function updateBanner(id, data) {
    await ensureOneActive(data)
   return model.updateOne({_id: id }, { ...data });
}

export async function deleteBanner(id) {
    return model.findByIdAndDelete(id);
}

export async function fetchActiveBanner() {
    return model.findOne({status: "Active"})
}

async function ensureOneActive(data){
    if (data.status === "Active") {
        await model.updateMany({status: "Active"},{status: "Draft"})
    }
}
