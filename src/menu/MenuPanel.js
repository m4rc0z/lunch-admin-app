import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from "react";
import {useEffect} from "react";
import styled from "styled-components";
import {getWeekNumber} from "../dateUtil";
import MenuList from "./MenuList";
import * as PropTypes from "prop-types";

const FlexColumnContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

function MenuPanel(props) {
    const [expanded, setExpanded] = React.useState(null);
    const [menus, setMenus] = React.useState(null);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const areMenusAvailable = (weekNumber, menus) => {
        return menus && menus.menus.some(menu => {
            return getWeekNumber(new Date(menu.date)) === weekNumber;
        });
    };

    useEffect(() => {
        fetch('/api/menus', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${props.auth.getAccessToken()}`
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                setMenus(responseJson);
            })
    }, []);

    return (
        <div>
            {
                Array(5)
                    .fill(getWeekNumber(new Date()))
                    .map((e, i) => i + 1)
                    .filter(weekNumber => areMenusAvailable(weekNumber, menus))
                    .map((weekNumber, i) => {
                        return (
                            <ExpansionPanel key={i} expanded={expanded === `panel${weekNumber}`} onChange={handleChange(`panel${weekNumber}`)}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography data-cy={`expansionPanelTitle${weekNumber}`}>KW {weekNumber}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <FlexColumnContainer>
                                        <MenuList weekNumber={weekNumber} menus={menus}/>
                                    </FlexColumnContainer>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        );
                    })
            }
        </div>
    );
}

export default MenuPanel;

MenuPanel.propTypes = {
    auth: PropTypes.object.isRequired,
};