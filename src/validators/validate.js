function validate(schema, target = 'body '){
    return (req, res, next) => {
        const data = req[target];

        //paso 1, verificar que haya datos
        if(!data || Object.keys(data).length === 0){
            return res.status(400).json({message: 'no data found'});

        }

        //paso2. validar contra el schema de con opciones
        const {error, value } = schema.validate(data, {
            abortEarly: false, // no detenerme en el primer error, mostrar todos
            stripUnknown: true, // eliminar campos mo definidos en el schema 

        })

        //paso3: si hay errores de validadcion devuelve 400, con mensaje claro
        if(error){
            return res.status(400).json({
                message: `error de validación en ${target}`,
                errores: error.details.map(err => err.message)
            })
        }
        //paso4: reemplazar el objeto original con los datos limpios
        req[target] = value;
         
        //continuamos
        next();

    }

}

export default validate