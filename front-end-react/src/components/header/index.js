import './index.css';
import Top from "./top";
import Bottom from "./bottom";

export default function Header(props) {
    return (
        <div className="header-container">
            <Top />
            <Bottom />
        </div>
    )
}