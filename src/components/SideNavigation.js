import * as React from "react";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
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
                {['Home'].map((text) => (
                    <ListItem
                        button
                        key={text}
                        onClick={props.clickHome}
                        data-cy="homeBtn"
                    >
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
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
    clickHome: PropTypes.func.isRequired,
};

export default SideNavigation;