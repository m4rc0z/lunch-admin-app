import React, {useEffect} from "react";
import * as PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {getRestaurantCategoriesAction, updateRestaurantCategoriesAction} from "../redux/restaurantActions";
import ChipInput from "material-ui-chip-input";
import Button from "@material-ui/core/Button/Button";

function Category(props) {
    useEffect(() => {
        props.getRestaurantCategoriesAction();
    }, []);

    const handleChange = (chips) => {
        console.log(chips);
        setState({...state, categories: chips});
    };

    const [state, setState] = React.useState({
        categories: [],
    });


    const saveCategories = () => {
        props.updateRestaurantCategoriesAction(state.categories);
    };

    return (
        <div data-cy={`categories_container`}>
            <ChipInput
                defaultValue={props.categories ? [...props.categories] : []}
                onChange={(chips) => handleChange(chips)}
            />
            <Button onClick={() => saveCategories()} variant="contained" color="primary">
                Speichern
            </Button>
        </div>
    );
}

Category.propTypes = {
    auth: PropTypes.object.isRequired,
    categories: PropTypes.array,
    getRestaurantCategoriesAction: PropTypes.func,
    updateRestaurantCategoriesAction: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    categories: state.restaurants.categories && state.restaurants.categories.map(c => c.description),
    ...ownProps
});

const mapDispatchToProps = dispatch => ({
    getRestaurantCategoriesAction: () => dispatch(getRestaurantCategoriesAction()),
    updateRestaurantCategoriesAction: (categories) => dispatch(updateRestaurantCategoriesAction(categories)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);