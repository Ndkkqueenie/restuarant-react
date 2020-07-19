import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label, FormFeedback} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';

    function RenderDish({dish}) {
        return(
            <div className="col-12 m-1">
                <Card>
                    <CardImg width="100" src={dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

    function RenderComments({comments, addComment, dishId}) {
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
                    <CommentForm dishId={dishId} addComment={addComment} />
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
                username: '',
                isModalOpen: false,
                touched: {
                    username: false
                }
            };
          }

        toggleModal() {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }
  
        handleSubmit(event) {
          this.toggleModal();
          this.props.addComment(this.props.dishId, this.rating.value, this.author.value, this.comment.value);
        }

        handleBlur = (field) => (evt) => {
            this.setState({
                touched: {...this.state.touched, [field]: true }
            });
        }

        validate(username) {
            const errors = {
                username: ''
            };

            if (this.state.touched.username && username.length < 3)
            errors.username = 'Must be >= 3 Characters';
            else if (this.state.touched.username && username.length > 15)
            errors.username = 'Must be <= 15 Characters'; 

            return errors
        }

        render(){
            const errors = this.validate(this.state.username);
            return (
                <div>
                    <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Submit Comment</Button>
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label htmlFor="rating">Rating</Label>
                                        <Input type="select" name="rating" id="rating" 
                                        innerRef={(input) => this.rating = input} >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="username">Your Name</Label>
                                        <Input type="username" id="username" name="username"
                                            innerRef={(input) => this.username = input} 
                                            valid={errors.username === ''}
                                            invalid={errors.username !== ''}
                                            onBlur={this.handleBlur('username')}
                                        />
                                        <FormFeedback>{errors.username}</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="comment"> Comment</Label>
                                        <Input type="textarea" name="comment" id="comment"
                                            rows="6"
                                            className="form-control"
                                            innerRef={(input) => this.comment = input}>
                                        </Input>
                                    </FormGroup>
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
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
                            addComment={props.addComment}
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