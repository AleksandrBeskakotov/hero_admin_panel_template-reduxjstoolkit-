import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { filtersActiveChanged, fetchFilters, selectAll } from "./heroesFiltersSlice";
import classNames from 'classnames';
import store from '../../store';
import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {
    
    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();

    console.log(`filters : ${filters}`);
    useEffect(() => {
        dispatch(fetchFilters());
        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        return arr.map(({name, className, value}) => {

            const btnClass = classNames('btn', className, {
                'active': value === activeFilter
            });
            
            return <button 
                        key={value} 
                        id={value} 
                        className={btnClass}
                        onClick={() => dispatch(filtersActiveChanged(value))}
                        >{name}</button>
        })
    }
   
    const buttons = renderFilters(filters);
   
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {buttons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;