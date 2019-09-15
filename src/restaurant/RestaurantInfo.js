import React from "react";
import * as PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {saveRestaurantAction} from "./redux/restaurantActions";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import Button from "@material-ui/core/Button/Button";
import {FlexColumnContainer} from "../components/container/FlexContainers";
import Paper from "@material-ui/core/Paper/Paper";

function RestaurantInfo(props) {
    const saveRestaurant = () => {
        if (props.restaurant) {
            const restaurant = Object.keys(values).reduce((acc, curr) => {
                acc[curr] = values[curr];
                return acc;
            }, props.restaurant);
            props.saveRestaurantAction(restaurant);
        }
    };

    const [values, setValues] = React.useState({
        name: undefined,
        address: undefined,
        postalCode: undefined,
        city: undefined,
    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };
    return (
        <Paper>
            <FlexColumnContainer data-cy={`restaurant_info_container`}>
                <FormControl>
                    <InputLabel htmlFor="restaurant-name">Name</InputLabel>
                    <Input id="restaurant-name" onChange={handleChange('name')} defaultValue={props.restaurant && props.restaurant.name}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-address">Adresse</InputLabel>
                    <Input id="restaurant-address" onChange={handleChange('address')} defaultValue={props.restaurant && props.restaurant.address}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-postalCode">PLZ</InputLabel>
                    <Input id="restaurant-postalCode" onChange={handleChange('postalCode')} defaultValue={props.restaurant && props.restaurant.postalCode}/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="restaurant-city">Stadt</InputLabel>
                    <Input id="restaurant-city" onChange={handleChange('city')} defaultValue={props.restaurant && props.restaurant.city}/>
                </FormControl>
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
    saveRestaurantAction: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    restaurant: state.restaurants[ownProps.restaurantId],
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    saveRestaurantAction: (restaurant) => dispatch(saveRestaurantAction(restaurant)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantInfo);