import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

const ReactMount = styled.div`
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    left: 50%;
    top: 10px;
    padding-left: 8px;
    padding-right: 8px;
    position: fixed;
    padding: 8px;
    transform: translate(-50%, 0);
    color: white;
    text-align: center;
    font-size: 12px;
    display: inline-block;
    font-weight: 300;
    font-family: 'Roboto';
    box-sizing: border-box;
    z-index: 10;
    > span {
        color: grey;
    }
`;

const VersionContainer = styled.div`
    display: flex;
    padding: 8px;
    border-radius: 6px;
    background: white;
    position: fixed;
    flex-direction: column;
    bottom: 16px;
    min-width: 100px;
    border: 1px solid #d5d5d5;
    right: 16px;
    box-sizing: border-box;
    flex-direction: column;
    span {
        color: grey;
        display: inline-block;
        padding-top: 8px;
        font-size: 12px;
        &:first-child {
            padding: 0;
        }
        strong {
            font-size: 12px;
        }
    }
`;

const PathContainer = styled.div`
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    padding: 8px;
    box-sizing: border-box;
    position: fixed;
    bottom: 16px;
    left: 16px;
    span {
        color: grey;
        display: inline-block;
        padding-top: 8px;
        font-size: 12px;
    }
`;

const PathGroup = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    line-height: 16px;
    li {
        display: inline-block;
        font-weight: 600;
        font-size: 12px;
        color: grey;
        &:after {
            content: '/';
            color: grey;
            position: relative;
            padding-left: 4px;
            padding-right: 4px;
            display: inline-block;
        }
    }
`;

const Paths = ({ items = [] }) => {
    // const location = window.location.hash;
    // const extract = str => {
    //     var rgx = /#(\w+)\b/gi;
    //     return str.replace(rgx);
    // };
    // console.log('path:::', location);
    // const locationExtracted = extract('#about');
    // console.log('paths extracted:::', locationExtracted);

    // const renderPaths = () => {
    //     return items.map((item, index) => {
    //         return <li key={index}>{item}</li>;
    //     });
    // };
    return (
        <PathContainer>
            <PathGroup>
                <li>dashboard</li>
            </PathGroup>
        </PathContainer>
    );
};

const Version = ({ component = '', version = '' }) => {
    return (
        <VersionContainer>
            <span>
                Name: <strong>{component}</strong>
            </span>
            <span>
                Version: <strong>{version}</strong>
            </span>
        </VersionContainer>
    );
};

const remainingItems = [
    { title: '<script src="js/app.js"></script>', complete: true },
    { title: '<script src="js/route.js"></script>', complete: true },
    {
        title: '<script src="js/settings/category-service.js"></script>',
        complete: true
    },
    {
        title: '<script src="js/settings/user-service.js"></script>',
        complete: true
    },
    {
        title: '<script src="js/workflow/workflow-service.js"></script>',
        complete: true
    },
    { title: '<script src="js/csr/csr-service.js"></script>', complete: false },
    { title: '<script src="js/controller.js"></script>', complete: false },
    {
        title: '<script src="js/dashboard/dashlevel1.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/changeworkflowdetails.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/showworkflowdetails.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/dashboard/dashlevel2.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/dashboard/dashlevel3.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/dashboard/alertslevel2.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/workflowreport.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/workflowreport2.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/workflowstarted.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/formreport.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/engagementreport.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/engagementheatmap.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/report/formdetailreport.js"></script>',
        complete: false
    },
    { title: '<script src="js/help.js"></script>', complete: false },
    {
        title:
            '<script src="js/settings/add-new-manager-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/add-customfield-controller.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/add-people.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow1-sidenav.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow2-sidenav.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/add-esign.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-sidenav.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-savemodule.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-esign.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-forms.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-senddata.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-logic.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-learn.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-multi-page.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/workflow/workflow3-assessment-quiz.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-embed-course.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow1.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow2.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-compliance.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-preview.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/workflow3-react.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/add-webhook.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/add-send-data.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/workflow/add-embed-course.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-brand-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-location-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-configuration-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-security-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-integration-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-managers-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-customfields-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-profilefields-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/add-profilefield-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-opt-category-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-user-controller.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/settings/login-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-userpermissions-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-bulkupload-controller.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/settings/user-detail-controller.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/csr/company-list-controller.js"></script>',
        complete: false
    },
    { title: '<script src="js/csr/csruserlist.js"></script>', complete: false },
    { title: '<script src="js/csr/csrlanglist.js"></script>', complete: false },
    {
        title: '<script src="js/csr/send-message-controller.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/csr/transfer-workflow-react-controller.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/csr/operations-controller.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/profiles/profiledetails.js"></script>',
        complete: false
    },
    {
        title: '<script src="js/settings/settings-esign.js"></script>',
        complete: false
    },
    {
        title:
            '<script src="js/settings/settings-oauth-controller.js"></script>',
        complete: false
    }
];

const ContentView = styled.div`
    width: 280px;
    position: fixed;
    right: -280px;
    top: 0;
    padding-left: 16px;
    height: 100%;
    overflow: scroll;
    z-index: 99;
    background: white;
    transition: all 0.3s ease-in-out;
    box-sizing: border-box;
    box-shadow: 0px 4px 11px -1px rgba(0, 0, 0, 0.13);
    ${props =>
        props.isActive &&
        css`
            right: 0;
        `};
    span {
        box-sizing: border-box;
        display: inline-block;
        color: grey;
        border-radius: 50%;
        height: 32px;
        width: 32px;
        text-align: center;
        line-height: 30px;
        margin-top: 6px;
        &:hover {
            cursor: pointer;
            background: grey;
            color: white;
        }
    }
`;

const Group = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
    padding: 8px;
    background: white;
    max-width: 600px;
`;

const Checkbox = styled.div`
    transition: all 0.3s ease-in-out;
    width: 24px;
    height: 24px;
    border: 1px solid grey;
    border-radius: 50%;
    background: white;
    ${props =>
        props.isActive &&
        css`
            background: #9ed32b;
            border: 1px solid #9ed32b;
            width: 32px;
            height: 32px;
        `};
`;

// Prettier Ignore

/* prettier-ignore-start */

/* prettier-ignore-end */

const List = styled.li`
    list-style: none;
    margin: 0;
    background: white;
    padding: 0;
    display: block;
    margin-bottom: 8px;
    border: 1px solid grey;
    border-radius: 6px;
    padding: 8px;
    color: grey;
    ${props =>
        props.isComplete &&
        css`
            background: grey;
            color: black;
        `};
`;

const Status = () => {
    const [isActive, setActive] = React.useState(true);

    if (!remainingItems) return <div />;
    const items = remainingItems.map((item, index) => {
        return (
            <List isComplete={item.complete} key={index}>
                <Checkbox isActive={item.complete} />
                {item.title}
            </List>
        );
    });

    const handleActive = () => {
        setActive(!isActive);
    };

    return (
        <ContentView isActive={isActive}>
            <span onClick={handleActive}>x</span>
            <Group>{items}</Group>
        </ContentView>
    );
};

const mapStateToProps = (state) => ({ state });

class Loader extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.loaderState === nextProps.loaderState) {
            return false;
        } else {
            return true;
        }
    }
    renderItems() {
        if (this.props.loaderState.todos) {
            return this.props.loaderState.todos.map((item, index) => {
                return <li key={index}>{item}</li>;
            });
        }
    }
    render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <Paths path="" />
                <Version version="1.0.0" component="ReactLoader" />
                <ReactMount>
                    <span className='titleTest'>
                        Title: <strong>{this.props.conceptName}</strong>
                    </span>
                </ReactMount>
                {/* {this.renderItems()} */}

                <Status />
            </React.Fragment>
        );
    }
}

export default connect(mapStateToProps)(Loader);
export {
    mapStateToProps
};
