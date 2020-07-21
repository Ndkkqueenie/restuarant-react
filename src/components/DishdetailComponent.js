import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,CardTitle, Breadcrumb, 
    BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { Control, Form, Errors } from 'react-redux-form';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

    function RenderDish({dish}) {
        return(
            <div className="col-12 m-1">
                <Card>
                    <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

    function RenderComments({comments, postComment, dishId}) {
        if (comments != null){
            let comms = comments.map((comm, i) => {
                let date = new Intl.DateTimeFormat('en-US', {
                    year:'numeric',
                    month: 'short',
                    day: '2-digit'
                }).format(new Date(Date.parse(comm.date)))
                
                return (
                        <ul key={comm.id} className="list-unstyled">
                            <li className="comment">{comm.comment}</li>
                            <li className="author">-- {comm.author}, {date}</li>
                        </ul>
                    );
                })
            
            return (
                <div className="col-12 m-1">
                    <h4>Comments</h4>
                    <div>{comms}</div>
                    <CommentForm dishId={dishId} postComment={postComment} />
                </div>
                
            );
        }
        else {
            return(
                <div></div>
            )
        }
    }
    
    class CommentForm extends Component {

        constructor(props) {
            super(props);
            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.state = {
                isModalOpen: false,
            };
          }

        toggleModal() {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }

        
        handleSubmit(values) {
            console.log('Current State is: ' + JSON.stringify(values));
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        }

        render(){
            return (
                <div>
                    <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Submit Comment</Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                            <ModalBody>
                            <Form model="comment" onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group" style={{margin: 8}} >
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select model=".rating"
                                        name="rating"
                                        value={this.rating} 
                                        id="rating"
                                        className="form-control"
                                    >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Row>
                                <Row className="form-group" style={{margin: 8}}>
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text 
                                        model=".author" 
                                        id="author" 
                                        name="author"
                                        placeholder="Full Name"
                                        className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                        />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Row>
                                <Row className="form-group" style={{margin: 8}}>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Control.textarea 
                                        model=".comment" 
                                        id="comment" 
                                        name="comment"
                                        rows="6"
                                        className="form-control"
                                        >
                                    </Control.textarea>
                                </Row>
                                    <Button type="submit" color="primary">Submit</Button>
                                </Form>
                            </ModalBody>
                    </Modal>
                </div>
            );
        }
    };

    const DishDetail = (props) => {

        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (props.dish != null) {
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>

                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
                            postComment={props.postCommentt}
                            dishId={props.dish.id}
                        />
                    </div>
                </div>
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }

        
    }

export default DishDetail;