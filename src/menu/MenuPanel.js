import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from "react";
import {useEffect} from "react";
import {getWeekNumber} from "../utils/dateUtil";
import MenuList from "./MenuList";
import * as PropTypes from "prop-types";
import {FlexColumnContainer} from "../components/container/FlexContainers";
import {connect} from "react-redux";
import {getMenusAction, setMenusAction} from "./redux/menuActions";
import {showNotificationAction} from "../components/notification/redux/notificationActions";

function MenuPanel(props) {
    const [expanded, setExpanded] = React.useState(null);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const areMenusAvailable = (weekNumber) => {
        return props && props.menus && props.menus.menus && props.menus.menus.some(menu => {
            return getWeekNumber(new Date(menu.date)) === weekNumber;
        });
    };

    useEffect(() => {
        props.getMenusAction(props.auth.getAccessToken());
    });

    return (
        <div>
            {
                Array(50)
                    .fill(getWeekNumber(new Date()))
                    .map((e, i) => i + 1)
                    .filter(weekNumber => areMenusAvailable(weekNumber))
                    .map((weekNumber, i) => {
                        return (
                            <ExpansionPanel key={i} expanded={expanded === `panel${weekNumber}`}
                                            onChange={handleChange(`panel${weekNumber}`)}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography
                                        data-cy={`expansionPanelTitle${weekNumber}`}>KW {weekNumber}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <FlexColumnContainer>
                                        <MenuList weekNumber={weekNumber} menus={props.menus}/>
                                    </FlexColumnContainer>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })
            }
        </div>
    );
}

MenuPanel.propTypes = {
    auth: PropTypes.object.isRequired,
    menus: PropTypes.object,
    getMenusAction: PropTypes.func,
};

const mapStateToProps = state => ({
    menus: state.menu.menus,
});

const mapDispatchToProps = dispatch => ({
    setMenusAction: (payload) => dispatch(setMenusAction(payload)),
    getMenusAction: (authToken) => dispatch(getMenusAction(authToken)),
    showNotificationAction: (payload) => dispatch(showNotificationAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuPanel);