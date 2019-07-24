import * as React from "react";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import RestaurantIcon from '@material-ui/icons/Restaurant';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton/IconButton";
import * as PropTypes from "prop-types";

const StyledIconButton = styled(IconButton)`
  && {
   color: inherit; 
  }
`;

function SideNavigation(props) {
    const [state, setState] = React.useState({
        open: false,
    });

    const toggleDrawer = (open) => () => {
        setState({ ...state, open });
    };

    const sideList = (
        <div>
            <List>
                    <ListItem
                        button
                        key={'Home'}
                        onClick={() => props.click('home')}
                        data-cy="homeBtn"
                    >
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        <ListItemText primary={'Home'} />
                    </ListItem>
                {props.isAdmin && <ListItem
                    button
                    key={'Restaurant'}
                    onClick={() => props.click('restaurants')}
                    data-cy="restaurantBtn"
                >
                    <ListItemIcon>
                        <RestaurantIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Restaurants'}/>
                </ListItem>
                }
            </List>
        </div>
    );

    return (
        <div>
            <StyledIconButton
                onClick={toggleDrawer( true)}
                aria-label="Menu"
                data-cy="menuBtn"
            >
                <MenuIcon/>
            </StyledIconButton>
            <SwipeableDrawer
                open={state.open}
                onClose={toggleDrawer( false)}
                onOpen={toggleDrawer( true)}
            >
                <div
                    tabIndex={0}
                    role="button"
                    onClick={toggleDrawer( false)}
                    onKeyDown={toggleDrawer( false)}
                >
                    {sideList}
                </div>
            </SwipeableDrawer>
        </div>
    );
}

SideNavigation.propTypes = {
    click: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};

export default SideNavigation;