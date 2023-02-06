
const {ShiftModel} = require('./models');


const getShifts = () => {
    return new Promise( (resolve, reject) => {
        ShiftModel.find((err, shifts) =>
        {
            if(err){
                reject(err);
            }
            else{
                resolve(shifts);
            }
        })
    })
}


const getShiftById = (id) => {
    return new Promise((resolve, reject) => {
        ShiftModel.findById(id, (err, shift) => {
            if(err){
                reject(err);
            }
            else{
                resolve(shift);
            }
        })
    })
}


const createShift = (obj) => {
    return new Promise((resolve, reject) =>{
        let shift = ShiftModel({
            Date : obj.Date,
            Ending_Hour : obj.Ending_Hour,
            Starting_Hour : obj.Starting_Hour,
            Employees : obj.Employees            
        });

        shift.save((err) => {
            if(err){
                reject(err);
            }
            else{
                resolve(shift._id);
            }
        })
    })
}


const updateShift = (id, obj) => {
    return new Promise((resolve, reject) => {
        ShiftModel.findByIdAndUpdate(id,
            {
                Date : obj.Date,
                Ending_Hour : obj.Ending_Hour,
                Starting_Hour : obj.Starting_Hour,
                Employees : obj.Employees
            }, (err) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve('Update successfully');
                }
            })
    })
}


const updateSingleField = (id, field, value) =>{
    return new Promise((resolve, reject) => {
        ShiftModel.findByIdAndUpdate(id, 
            {[field]: value}, 
            (err) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve('Update successfully');
                }
            });
    })
}


const deleteShift = (id) => {
    return new Promise((resolve, reject) => {
        ShiftModel.findByIdAndDelete(id, (err) => {
            if(err){reject(err)} else {resolve('Deleted successfully')}
        })
    })
}

module.exports = {  getShifts,   getShiftById,   createShift,   updateShift,   deleteShift, updateSingleField}