import React from 'react';
import api from '../utils/api';
// import Navbar from './Navbar';
// import Loading from './Loading';
import { Link } from "react-router-dom";
// import PropTypes from 'prop-types';
import UserContext from '../context/user';
import { restoreUser } from '../utils/storage';
import Pagination from 'bulma-pagination-react';



function NoResults({ message, error }) {
    return (
        <div className="notification is-danger" id="no-results">
            <p>{message}</p>
            <p>{error}</p>
        </div>
    )
}

NoResults.propTypes = {
    message: PropTypes.string.isRequired,
    error: PropTypes.string
}

function MoviesGrid({ movies, imageBaseURL, onChangePage, currentPage, totalPages }) {
    return (
        <React.Fragment>
            {movies.length === 0
                ? <NoResults message='No results found!!' />
                : <div className="columns is-multiline cards-group">
                    {movies.map(movie => (
                        <div key={movie.id} className="column is-one-quarter-desktop is-half-tablet">
                            <div className="card">
                                <div className="card-image">
                                    <figure className="image is-4by3">
                                        <img src={movie.poster_path ? `${imageBaseURL}original/${movie.backdrop_path}` : 'https://bulma.io/images/placeholders/1280x960.png'} alt="Placeholder" />
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="media">
                                        <div className="media-left">
                                            <figure className="image is-48x48">
                                                <img src={movie.backdrop_path ? `${imageBaseURL}w300/${movie.backdrop_path}` : 'https://bulma.io/images/placeholders/96x96.png'} alt="Placeholder" />
                                            </figure>
                                        </div>
                                        <div className="media-content">
                                            <p className="title is-4">{movie.title}</p>
                                            <p className="subtitle is-6">{`Original Title: ${movie.original_title}`}</p>
                                        </div>
                                    </div>
                                    <div className="content">
                                        {movie.overview.substring(0, 150)}
                                        <br />
                                        <Link to={`/detail/${movie.id}`}>read more...</Link>
                                        <br />
                                        <time>{`Release Date: ${movie.release_date}`}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Pagination
                        pages={totalPages}
                        currentPage={currentPage}
                        onChange={(page) => { onChangePage(page) }}

                    />
                </div>}

        </React.Fragment>
    )
}

MoviesGrid.propType = {
    movies: PropTypes.array.isRequired,
    imageBaseURL: PropTypes.string.isRequired
}

export default class Movies extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            movies: [],
            text: '',
            imageBaseURL: '',
            remaningQueries: 40,
            error: false,
            currentPage: 1,
            totalPages: 50
        }
        this.changeText = this.changeText.bind(this);
        this.handlerPage = this.handlerPage.bind(this);
        console.log('Constructor Movies: ', this.context);
    }

    goPage(page) {
        if (page) {
            return this.props.history.push(`home?page=${page}`)
        }
        this.props.history.push('home');
    }

    changeText(event) {
        const { getFilms } = api(this.context.user.apikey);
        this.setState({
            loading: true,
            text: event.target.value,
            currentPage: 1
        })
        //Cuando nos metemos en el buscador y tecleamos nos vamos al home
        this.goPage();

        if (event.target.value.trim().length > 0) {
            return this.fetchFilms(event.target.value, this.context.user.birthDate, this.state.currentPage)
        }

        this.discoverFilms(this.context.user);
    }

    fetchFilms(text, year, page) {
        const { getFilms } = api(this.context.user.apikey);
        getFilms(text, year, page)
            .then(response => this.setState({
                movies: response.data.results,
                totalPages: response.data.total_pages,
                loading: false,
                remaningQueries: response.headers['x-ratelimit-remaining']
            })).catch(err => console.error(error))

    }

    handlerPage(currentPage) {
        this.setState({
            currentPage,
            loading: true,
        })
        this.props.history.push(`home?page=${currentPage}`)

    }

    updateUserFromStorage() {
        const user = restoreUser();
        if (user !== null) {
            this.context.updateUser(user);
        }
        return user;
    }

    // componentWillMount() {
    //   this.updateUserFromStorage();   
    // }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.currentPage != this.state.currentPage) {
            //Estamos en busqueda de input 
            if (this.state.text.trim().length > 0) {
                console.log('Paginacion por input');
                return this.fetchFilms(this.state.text, this.context.user.birthDate, this.state.currentPage)
            }
            this.discoverFilms(this.context.user, this.state.currentPage)
        }

    }

    checkQueryParams() {
        const params = new URLSearchParams(this.props.location.search);
        const page = parseInt(params.get('page')) || 1;
        return page;
    }

    componentDidMount() {
        const user = this.updateUserFromStorage() || this.context.user;
        console.log(user);
        if (user) {


            const page = this.checkQueryParams() || this.currentPage;
            this.setState({
                currentPage: page
            })
            this.discoverFilms(user, page);
        } else {
            this.props.history.push('/register');
        }
    }

    isAuth() {
        return Object.entries(this.context.user).length !== 0
    }

    discoverFilms(user, page) {
        const { getDiscoverFilms, getConfigurationImages } = api(user.apikey);
        Promise.all([
            getConfigurationImages(),
            getDiscoverFilms(user.birthDate, page)
        ]).then(results => this.setState({
            imageBaseURL: results[0].secure_base_url,
            movies: results[1].results,
            totalPages: results[1].total_pages,
            loading: false
        })).catch(({ response }) => {
            if (response.data.status_code === 7) {
                console.warn(response.data.status_message);
                this.setState({
                    loading: false,
                    error: true
                })
            }
        })
    }

    render() {
        const user = this.context.user;
        const { loading, movies, remaningQueries, imageBaseURL, error, currentPage, totalPages } = this.state;
        if (Object.entries(user).length === 0) {
            return null;
        }
        if (error) {
            return (
                <NoResults message='Error!!!' error='Invalid api key' />
            )
        }
        return (
            <React.Fragment>
                <Navbar text={this.state.text} onChangeText={this.changeText} remaningQueries={remaningQueries} showSearch text={this.state.text} />
                {console.log(this.state)}
                {loading === true
                    ? <Loading text='Fetching Movies' />
                    : <MoviesGrid movies={movies} imageBaseURL={imageBaseURL}
                        totalPages={totalPages} currentPage={currentPage} onChangePage={this.handlerPage}
                        text={this.state.text}
                    />
                }

            </React.Fragment>
        )
    }
}