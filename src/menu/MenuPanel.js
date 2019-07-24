import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from "react";
import {getWeekNumber} from "../utils/dateUtil";
import MenuList from "./MenuList";
import * as PropTypes from "prop-types";
import {FlexColumnContainer} from "../components/container/FlexContainers";
import {connect} from "react-redux";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import styled from "styled-components";
import {StyledPaddingContainer} from "../common_styles";

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

function MenuPanel(props) {
    const [expanded, setExpanded] = React.useState(null);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const areMenusAvailable = (weekNumber) => {
        return props && props.menus && props.menus.some(menu => {
            return getWeekNumber(new Date(menu.date)) === weekNumber;
        });
    };

    return (
        <StyledPaddingContainer>
            {
                Array(50)
                    .fill(getWeekNumber(new Date()))
                    .map((e, i) => i + 1)
                    .filter(weekNumber => areMenusAvailable(weekNumber))
                    .map((weekNumber, i) => {
                        return (
                            <StyledPaddingContainer key={i}>
                                <ExpansionPanel
                                    expanded={expanded === `panel${weekNumber}`}
                                    onChange={handleChange(`panel${weekNumber}`)}
                                >
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Typography data-cy={`expansionPanelTitle${weekNumber}`}>
                                            KW {weekNumber}
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <FlexColumnContainer>
                                            <MenuList weekNumber={weekNumber} menus={props.menus}/>
                                            <StyledButtonContainer>
                                                <IconButton
                                                    onClick={() => props.deleteMenus(weekNumber)}
                                                    data-cy={`delete_week_${weekNumber}`}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </StyledButtonContainer>
                                        </FlexColumnContainer>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </StyledPaddingContainer>
                        );
                    })
            }
        </StyledPaddingContainer>
    );
}

MenuPanel.propTypes = {
    menus: PropTypes.array,
    deleteMenus: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return ({
        ...state,
        ...ownProps
    });
};

export default connect(mapStateToProps, undefined)(MenuPanel);