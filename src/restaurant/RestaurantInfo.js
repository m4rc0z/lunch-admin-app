import React, {useEffect} from "react";
import * as PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {
    getRestaurantCategoriesAction,
    saveRestaurantAction,
    uploadRestaurantImageAction,
    uploadRestaurantMapImageAction
} from "./redux/restaurantActions";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import Button from "@material-ui/core/Button/Button";
import {FlexColumnContainer} from "../components/container/FlexContainers";
import Paper from "@material-ui/core/Paper/Paper";
import Select from 'react-select';

function RestaurantInfo(props) {
    useEffect(() => {
        props.getRestaurantCategoriesAction();
    }, []);

    const saveRestaurant = () => {
        if (props.restaurant) {
            const restaurant = Object.keys(values).reduce((acc, curr) => {
                acc[curr] = values[curr];
                return acc;
            }, props.restaurant);
            props.saveRestaurantAction(restaurant);
        }
    };

    const uploadRestaurantImageAction = () => {
        props.uploadRestaurantImageAction(image, props.restaurantId);
    };

    const uploadRestaurantMapImageAction = () => {
        props.uploadRestaurantMapImageAction(image, props.restaurantId);
    };

    const [values, setValues] = React.useState({
        name: undefined,
        address: undefined,
        postalCode: undefined,
        city: undefined,
        longitude: undefined,
        latitude: undefined,
        imageUrl: undefined,
        mapImageUrl: undefined,
        categories: undefined,
        openingTimesLine1: undefined,
        openingTimesLine2: undefined,
    });


    const [selectedOptions, setSelectedOptions] = React.useState(props.restaurant.categories && props.restaurant.categories.map(c => ({label: c.description, value: c._id})));

    const options = props.categories && props.categories.map(c => ({label: c.description, value: c._id}));

    const handleOptionChange = selected => {
        setSelectedOptions(selected);
        setValues({...values, categories: selected.map(o => o.value)})
    };

    const [image, setImage] = React.useState({
        image: undefined,
    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    const handleImageChange = event => {
        setImage(event.target.files[0]);
    };

    const handleMapImageChange = event => {
        setImage(event.target.files[0]);
    };

    return (
        <Paper>
            <FlexColumnContainer data-cy={`restaurant_info_container`}>
                <FormControl>
                    <InputLabel htmlFor="restaurant-name">Name</InputLabel>
                    <Input id="restaurant-name" onChange={handleChange('name')}
                           defaultValue={props.restaurant && props.restaurant.name}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-address">Adresse</InputLabel>
                    <Input id="restaurant-address" onChange={handleChange('address')}
                           defaultValue={props.restaurant && props.restaurant.address}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-postalCode">PLZ</InputLabel>
                    <Input id="restaurant-postalCode" onChange={handleChange('postalCode')}
                           defaultValue={props.restaurant && props.restaurant.postalCode}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-city">Stadt</InputLabel>
                    <Input id="restaurant-city" onChange={handleChange('city')}
                           defaultValue={props.restaurant && props.restaurant.city}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-longitude">Longitude</InputLabel>
                    <Input id="restaurant-longitude" onChange={handleChange('longitude')}
                           defaultValue={props.restaurant && props.restaurant.longitude}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-latitude">Latitude</InputLabel>
                    <Input id="restaurant-latitude" onChange={handleChange('latitude')}
                           defaultValue={props.restaurant && props.restaurant.latitude}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-opening-times-1">Öffnungszeiten Zeile 1</InputLabel>
                    <Input id="restaurant-latitude" onChange={handleChange('openingTimesLine1')}
                           defaultValue={props.restaurant && props.restaurant.openingTimesLine1}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-opening-times-2">Öffnungszeiten Zeile 2</InputLabel>
                    <Input id="restaurant-latitude" onChange={handleChange('openingTimesLine2')}
                           defaultValue={props.restaurant && props.restaurant.openingTimesLine2}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-categories">Restaurant Kategorien</InputLabel>
                    <Select
                        isMulti={true}
                        value={selectedOptions}
                        onChange={handleOptionChange}
                        options={options}
                    />
                </FormControl>
                {
                    props.restaurant.imageUrl
                        ? <img src={props.restaurant.imageUrl}></img>
                        : undefined
                }
                <FormControl>
                    <InputLabel htmlFor="restaurant-image">Image upload</InputLabel>
                    <Input type='file' name='image' id="restaurant-image" onChange={handleImageChange}/>
                </FormControl>
                <Button onClick={() => uploadRestaurantImageAction()} variant="contained" color="primary">
                    Upload
                </Button>
                {
                    props.restaurant.imageUrl
                        ? <img src={props.restaurant.mapImageUrl}></img>
                        : undefined
                }
                <FormControl>
                    <InputLabel htmlFor="restaurant-map-image">Map Image upload</InputLabel>
                    <Input type='file' name='image' id="restaurant-map-image" onChange={handleMapImageChange}/>
                </FormControl>
                <Button onClick={() => uploadRestaurantMapImageAction()} variant="contained" color="primary">
                    Upload
                </Button>
                <Button onClick={() => saveRestaurant()} variant="contained" color="primary">
                    Speichern
                </Button>
            </FlexColumnContainer>
        </Paper>
    );
}

RestaurantInfo.propTypes = {
    restaurantId: PropTypes.string,
    restaurant: PropTypes.object,
    categories: PropTypes.array,
    saveRestaurantAction: PropTypes.func,
    uploadRestaurantImageAction: PropTypes.func,
    uploadRestaurantMapImageAction: PropTypes.func,
    getRestaurantCategoriesAction: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    restaurant: state.restaurants[ownProps.restaurantId],
    categories: state.restaurants.categories,
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    saveRestaurantAction: (restaurant) => dispatch(saveRestaurantAction(restaurant)),
    getRestaurantCategoriesAction: () => dispatch(getRestaurantCategoriesAction()),
    uploadRestaurantImageAction: (image, restaurant) => dispatch(uploadRestaurantImageAction(image, restaurant)),
    uploadRestaurantMapImageAction: (image, restaurant) => dispatch(uploadRestaurantMapImageAction(image, restaurant))
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantInfo);