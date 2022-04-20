import {useHttp} from '../../hooks/http.hook';
import { useState } from "react";
import { heroCreated } from "../heroesList/heroesSlice";
import {selectAll} from "../heroesFilters/heroesFiltersSlice"
import { useDispatch, useSelector } from "react-redux";
import store from '../../store';
import Spinner from '../spinner/Spinner';
import { v4 as uuidv4 } from 'uuid';

const HeroesAddForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());

    const {request} = useHttp();
    const dispatch = useDispatch();

    const onCreate = (e) => {
        e.preventDefault();
        
        const hero = {
            id: uuidv4(),
            name,
            description,
            element
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(hero))
            .then(res => console.log(res, 'Отправка успешна'))
            .then(dispatch(heroCreated(hero)))
            .catch(err => console.log(err));

        setName('');
        setDescription('');
        setElement('');
    }
    
    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }
    
    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Элемнтов пока нет</h5>
        }
        return filters
                .filter(filter => filter.value !== 'all')
                .map(filter => (<option key={filter.value} value={filter.value}>{filter.name}</option>));
    }

    const options = renderFiltersList(filters);
        
    return (
        <form onSubmit={onCreate} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name"
                    placeholder="Как меня зовут?"
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}/>
            
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    value={element}
                    className="form-select" 
                    id="element" 
                    name="element"
                    onChange={(e) => setElement(e.target.value)}>
                    <option >Я владею элементом...</option>
                    {options}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;