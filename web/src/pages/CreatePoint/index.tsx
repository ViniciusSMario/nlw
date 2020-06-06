import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import logo from '../../assets/logo.svg';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import { Map, TileLayer, Marker } from 'react-leaflet';

//estado para array ou objeto precisa informar op tipo da variavel a ser armazenada

interface Item {
    id: number,
    name: string,
    image_url: string
};

interface IbgeUfResponse {
    sigla: string
}

interface IbgeCityResponse {
    nome: string
}



const CreatePoint = () => {

    //criando estado
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedItem, setSelectedItem] = useState<number[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [selecteFile, setSelecteFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        axios.get<IbgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla);

                setUfs(ufInitials);
            });
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que a uf mudar
        if (selectedUf === '0') {
            return;
        }

        axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);

                setCities(cityNames);
            });

    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({
            ...formData, [name]: value
        });
    }

    function handleSelectItem(id: number) {
        const alreadySelect = selectedItem.findIndex(item => item === id);

        if (alreadySelect >= 0) {
            const filteredItems = selectedItem.filter(item => item !== id);
            setSelectedItem(filteredItems);
        } else {
            setSelectedItem([...selectedItem, id])
        }


    }

    async function handleSubmit(event: FormEvent) {
        try {
            event.preventDefault();

            const { name, email, whatsapp } = formData;
            const uf = selectedUf;
            const city = selectedCity;
            const [latitude, longitude] = selectedPosition;
            const items = selectedItem;

            const data = new FormData();

            data.append('name', name);
            data.append('email', email);
            data.append('whatsapp', whatsapp);
            data.append('uf', uf);
            data.append('city', city);
            data.append('latitude', String(latitude));
            data.append('longitude', String(longitude));
            data.append('items', items.join(','));

            if (selecteFile) {
                data.append('image', selecteFile);
            }

            await api.post('points', data);

            alert('Ponto de Coleta Criado!');

            history.push('/');
        } catch (Exception) {
            alert(Exception);
        }
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"></img>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelecteFile} />

                <fieldset>
                    <legend><h2>Dados</h2></legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer>

                        <Marker position={selectedPosition}></Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))};
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))};
                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens</span>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => (
                            <li
                                className={selectedItem.includes(item.id) ? 'selected' : ''}
                                key={item.id}
                                onClick={() =>
                                    handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.name}></img>
                                <span>{item.name}</span>
                            </li>))}


                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>

        </div>
    );
}

export default CreatePoint;