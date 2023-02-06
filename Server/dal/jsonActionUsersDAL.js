let path = require('path'); 
const jsonfile = require('jsonfile');
const file = path.join(__dirname, '..', '/data/actions.json');

const readFile = () =>
{
    return new Promise((resolve, reject) =>
    {                
        jsonfile.readFile(file, function(err, data)
        {
            if(err)
            {
                reject(err);
            }
            resolve(data);
        });
    });
}



const writeToFile = (data) =>
{
    readFile().then( (existingData) => {
        existingData.actions.push(data);
        jsonfile.writeFile(file, existingData, (err) => {
            if(err){
                console.error(err);
            }
        });
    })
    .catch( (err) => {
        console.error(err);
    })
}


module.exports = {readFile, writeToFile};