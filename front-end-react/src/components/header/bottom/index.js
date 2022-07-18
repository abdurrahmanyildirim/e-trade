import './index.css';
import { useSelector } from 'react-redux'

export default function Bottom() {
    const categories = useSelector((state) => state.category.categories);
    console.log('Categories : ', categories);

    return (
        <div className="header-bottom-container">
            <ul className="navs">
                <li className="nav">Ana Sayfa</li>
                {categories && categories.map(category => {
                    return (
                        <li className="nav" key={category._id}>
                            {category.name}
                        </li>
                    )
                })}
                <li className="nav">İletişim</li>
            </ul>
        </div>
    )
}