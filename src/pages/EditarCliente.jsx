import React from 'react'
import { obtenerCliente, actualizarCliente } from '../data/clientes.js'
import { Form, useNavigate, useLoaderData, useActionData, redirect } from 'react-router-dom'
import Formulario from '../components/Formulario.jsx'
import Error from '../components/Error.jsx'


export async function loader({ params }) {
    const cliente = await obtenerCliente(params.clienteId)
    if (Object.values(cliente).length === 0) {
        throw new Response('', {
            status: 404,
            statusText: 'No Hay Resultados'
        })
    }
    return cliente
}

export async function action({ request, params }) {
    const formData = await request.formData()
    const datos = Object.fromEntries(formData)

    const email = formData.get('email')
    //validacion
    const errores = []
    if (Object.values(datos).includes('')) {
        errores.push('Todos los campos son obligatorios')
    }

    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    if (!regex.test(email)) {
        errores.push('El Email No Es Valido')
    }

    //retornar datos si hay errores
    if (Object.keys(errores).length) {
        return errores
    }

    // actualizar el cliente
    await actualizarCliente(params.clienteId, datos)

    return redirect('/')
}

const EditarCliente = () => {

    const navigate = useNavigate()
    const cliente = useLoaderData()
    const errores = useActionData()
    return (
        <>
            <h1 className='font-black text-4xl text-blue-900'>Editar Cliente</h1>
            <p className='mt-3'>Modifica Los Datos De Un Cliente</p>

            <div className='flex justify-end'>
                <button className='bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 font-bold uppercase rounded-md'
                    onClick={() => navigate('/')}>
                    Volver
                </button>
            </div>

            <div className='bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-5'>
                {errores?.length && errores.map((error, i) => <Error key={i}>{error}</Error>)}
                <Form
                    method='post'
                    noValidate
                >
                    <Formulario
                        cliente={cliente} />

                    <input
                        type='submit'
                        className='mt-5 bg-blue-800 hover:bg-blue-900 p-3 cursor-pointer uppercase font-bold
                     text-white text-lg rounded-md md:w-full'
                        value='Modificar Cliente'
                    />
                </Form>
            </div>
        </>
    )
}

export default EditarCliente