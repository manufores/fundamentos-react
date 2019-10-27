import React from 'react';
import UserConsumer from '../context/user';
import axios from 'axios';
import { Link } from "react-router-dom";


export default class AdvDetail extends React.Component {
    static contextType = UserConsumer;
    constructor(props) {
        super(props);

        this.state = {
            article: []
        }
    }

    advertId = null;

    componentWillMount() {
        this.advertId = this.props.match.params.id;
        this.getAds();
    }

    getAds = () => {
        const id = this.props.match.params.id;
        const API_URL = 'http://localhost:3001/';
        const endPoint = `${API_URL}apiv1/anuncios/${id}`;
        axios.get(endPoint)
            .then(res => this.setState({
                article: res.data.result
            }))
    }


    componentDidMount() {
        //Chequeo sesion del contexto, si no existe redirijo a register
        const session = this.context.session
        console.log(session);
        if (!session) {
          return this.props.history.push('/register');
        } 
      }

    render() {
        // const { movie, imageBaseURL, loading } = this.state;
        const API_URL = 'http://localhost:3001/';
        const { article } = this.state;
        return (
            <React.Fragment>
                {/* <Navbar showSearch={false}/> */}
                {/* {loading 
              ? <Loading text='Loading Advert Detail'/> */}
                <div key={article._id} className="movie-detail-container">
                    <div className="movie-card-container">
                        <div className="image-container">
                            <div className="bg-image" style={{ backgroundImage: `url(${API_URL}${article.photo})` }} />
                        </div>
                        <div className="card-image">
                        <figure className="image is-4by3">
                            <img src={article.photo ? `${API_URL}${article.photo}` : 'https://bulma.io/images/placeholders/1280x960.png'} alt="Placeholder" />
                        </figure>
                        </div>
                        <div className="movie-info">
                            <h2>Advert Details</h2>
                            <div>
                                <h1>{article.name}</h1>
                            </div>
                            <p>{article.description}</p>
                            <div className="tags-container">
                                {article.tags && article.tags.map(tag =>  <span key={tag}>{tag}</span>)}
                            </div>
                            <div>
                                <Link to={'/editar/' +article._id} className="button is-primary is-rounded">Editar</Link>
                            </div>
                        </div>
                    </div>
                </div>
          </React.Fragment>
        );

    }
}

