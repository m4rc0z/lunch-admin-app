import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";
import * as PropTypes from "prop-types";
import styled from "styled-components";

const FlexColumnContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
const StyledOverviewContainer = styled.div`
  padding: 10px 0;
`;

function MenuImportOverview(props) {
    // TODO: rename Gang1 to course1
    return (
        <StyledOverviewContainer>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelDetails>
                    {props.menus && props.menus.map((menu, i) => {
                        return (
                            <FlexColumnContainer key={i}>
                                <div data-cy={`menuOverview_${i}_date`}>{menu.Datum}</div>
                                <div data-cy={`menuOverview_${i}_course1`}>{menu.Gang1}</div>
                                <div data-cy={`menuOverview_${i}_course2`}>{menu.Gang2}</div>
                                <div data-cy={`menuOverview_${i}_course3`}>{menu.Gang3}</div>
                            </FlexColumnContainer>
                        );
                    })}
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <Button size="small" onClick={() => props.onCancel()}>Cancel</Button>
                    <Button size="small" color="primary" onClick={() => props.saveMenus()} data-cy={`menuOverview_save`}>
                        Save
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        </StyledOverviewContainer>
    );
}

MenuImportOverview.propTypes = {
    menus: PropTypes.array.isRequired,
    saveMenus: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    auth: PropTypes.object.isRequired,
};

export default MenuImportOverview;