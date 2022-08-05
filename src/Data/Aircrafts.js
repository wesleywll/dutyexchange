import cnst from '../utility/PostForm/constant';

const getPlaneTypeArray = (planeType) => {
    // return plane type as array of planes
    switch (planeType) {
        case cnst.AIRBUS:
            return [cnst.A330, cnst.A350]
        default:
            return [planeType]
    }
}

export default getPlaneTypeArray;