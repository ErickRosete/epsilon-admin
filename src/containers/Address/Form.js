import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';


import Grid from '@material-ui/core/Grid';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
// npm i google-map-react
// Run  npm update handlebars --depth 6  to resolve 1 vulnerability
// wow http://google-map-react.github.io/google-map-react/map/balderdash
import Marker from './Marker';
// npm i react-pure-render
import GoogleMapReact from 'google-map-react';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

const key = "AIzaSyC0OyV5AleQHaNYkrwPC8q2DegYgSagb5E";
const placesScript = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=initMap`
const styles = theme => ({
    address: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: theme.palette.secondary.main,
        flexDirection: "column"
    },
    linea: {
        display: 'flex'
    },
    mybaby: {
        width: "100%"
    }
});

export class Form extends Component {
    // static defaultProps = {
    //     center: [59.938043, 30.337157],
    //     zoom: 15,
    //     greatPlaceCoords: { lat: 59.724465, lng: 30.080121 }
    // };

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            state: "Rio Culiacan",
            calle: "callecita",
            streetNumber: "27",
            city: "Mexicali",
            country: "Mexico",
            zipCode: "21200",
            scriptLoaded: false,
            center: [59.938043, 30.337157],
            zoom: 15,
            greatPlaceCoords: { lat: 59.724465, lng: 30.080121 }
        };
    }

    handleChange = address => {
        this.setState({ address });
    };

    locateString = (param, results) => {
        var found = results[0].address_components.findIndex((element) => {
            return element.types.find(type => {
                return type === param
            }
            );
        })
        return found;
    }

    handleSelect = address => {
        console.log("selected")
        console.log(address)
        this.setState({ address })
        let json;
        geocodeByAddress(address)
            .then(results => {
                console.log(results)
                let latLng = getLatLng(results[0])
                let country; const countryInd = this.locateString("country", results)
                country = countryInd > -1 ? results[0].address_components[countryInd].long_name : ""
                let zip; const zipInd = this.locateString("postal_code", results)
                zip = zipInd > -1 ? results[0].address_components[zipInd].long_name : ""
                let street; const streetInd = this.locateString("street_number", results)
                street = streetInd > -1 ? results[0].address_components[streetInd].long_name : ""
                let state; const stateInd = this.locateString("administrative_area_level_1", results)
                state = stateInd > -1 ? results[0].address_components[stateInd].long_name : ""
                let city; const cityInd = this.locateString("locality", results)
                city = cityInd > -1 ? results[0].address_components[cityInd].long_name : ""
                let calle; const calleInd = this.locateString("route", results)
                calle = calleInd > -1 ? results[0].address_components[calleInd].long_name : ""
                json = {
                    country: country,
                    state: state,
                    city: city,
                    zipCode: zip,
                    streetNumber: street,
                    calle: calle,
                }
                this.setState({
                    ...json
                })
                return latLng
            }
            )
            .then(latLng => {
                json.LatLng = latLng
                console.log(latLng)
                let centerlat = latLng.lat
                let centerlng = latLng.lng

                console.log(json)
                console.log('Success', latLng)
                this.setState({
                    center: [centerlat, centerlng],
                    // center:[49.938043, 20.337157],
                    zoom: 15,
                    greatPlaceCoords: latLng
                })
            })
            .catch(error => console.error('Error', error));
    };

    handleAddress = () => {
        geocodeByAddress(this.state.address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
    }

    initMap = () => {
        this.setState({
            scriptLoaded: true,
        })
    }

    componentDidMount() {
        window.initMap = this.initMap
        const gmapScriptEl = document.createElement(`script`)
        gmapScriptEl.src = placesScript
        gmapScriptEl.async = true
        document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)
    }

    //great
    // componentDidUpdate(){
    //     //no utilizar setstate aqui--> loop infinito
    //     console.log(this.state.address)
    //     // this.handleAddress();
    //     geocodeByAddress("hola")
    //         .then(results => getLatLng(results[0]))
    //         .then(latLng => console.log('Success', latLng))
    //         .catch(error => console.error('Error', error));
    // }

    onSubmitHandler = event => {
        event.preventDefault();
        console.log("clicked")
        let address = {
            country: this.state.country,
            // state: this.state.state,
            city: this.state.city,
            zipCode: Number(this.state.zipCode),
            exteriorNumber: Number(this.state.streetNumber),
            street: this.state.calle,
        }
        console.log(address)
        this.props.onSubmit(address);
        console.log(this.props.onSubmit)
    };

    changeDirectionHandler = (metodo, suggestions, event) => {
        // this.setState({
        //     title: event.target.value
        // });
        // const address = event.target.value
        console.log(event.target.value)
        console.log(metodo(event.target.value))
        console.log(suggestions)
        this.setState({ address: event.target.value })
        // this.handleAddress();
    };

    render() {
        // const classes = this.props.classes;
        return (
            <div>
                {this.state.scriptLoaded &&
                    <div>
                        {/* <p>Formulario modificacion direccion {this.props.address.street}</p> */}
                        <PlacesAutocomplete
                            value={this.state.address}
                            onChange={this.handleChange}
                            onSelect={this.handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <Grid item xs={12}>
                                        {/* <p>{this.state.address}</p> */}
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="my-input">Direccion</InputLabel>
                                            {/* <Input id="my-input" aria-describedby="my-helper-text" /> */}
                                            <Input
                                                id="my-input"
                                                aria-describedby="my-helper-text"
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                {...getInputProps({
                                                    placeholder: 'Search Places ...',
                                                    className: 'location-search-input',
                                                })}
                                            // onChange={this.changeDirectionHandler.bind(this,getInputProps,suggestions)}
                                            />
                                            <FormHelperText id="my-helper-text">Nunca compartiremos tu direccion</FormHelperText>
                                        </FormControl>
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {suggestions.map(suggestion => {
                                                // console.log(suggestions)
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                // inline style for demonstration purpose
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style,
                                                        })}
                                                    >
                                                        <span>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Grid>
                                </div>
                            )}
                        </PlacesAutocomplete>
                        <div style={{ height: '50vh', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: key }}
                                center={this.state.center}
                                defaultZoom={this.state.zoom}
                            >
                                <Marker
                                    // lat={59.955413}
                                    // lng={30.337844}
                                    {...this.state.greatPlaceCoords}
                                />
                            </GoogleMapReact>
                        </div>
                        <form className="product-form" onSubmit={this.onSubmitHandler}>
                            <Grid container spacing={24} justify="center">
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-full-width"
                                        label="Calle"
                                        style={{ margin: 8 }}
                                        placeholder="Escribir calle"
                                        helperText="Full width!"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.calle}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-full-width"
                                        label="Número exterior"
                                        style={{ margin: 8 }}
                                        placeholder="Escribir numero exterior"
                                        helperText="Full width!"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.streetNumber}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-full-width"
                                        label="Ciudad"
                                        style={{ margin: 8 }}
                                        placeholder="Escribir ciudad"
                                        helperText="Full width!"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.city}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-full-width"
                                        label="País"
                                        style={{ margin: 8 }}
                                        placeholder="Escribir pais"
                                        helperText="Full width!"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.country}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        id="outlined-full-width"
                                        label="Código Postal"
                                        style={{ margin: 8 }}
                                        placeholder="Escribir código postal"
                                        helperText="Full width!"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={this.state.zipCode}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Button type="submit" variant="contained" color="primary" autoFocus>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                }
            </div>
        )
    }
}

Form.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Form);