import React, { useState, useEffect } from 'react';
import MovieDataService from '../services/movies';
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const Movie = (props) => {
  const [movie, setMovie] = useState({
    id: null,
    title: '',
    rated: '',
    reviews: [],
  });

  const getMovie = (id) => {
    MovieDataService.get(id)
      .then((response) => {
        setMovie(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const params = useParams();

  useEffect(() => {
    getMovie(params.id);
  }, [params.id]);

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setMovie((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <h1>Movie</h1>
      <Container>
        <Row>
          <Col>
            <Image src={movie.poster + '/100px250'} fluid />
          </Col>
          <Col>
            <Card>
              <Card.Header as='h5'>{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
                {props.user && <Link to={'/movies/' + params.id + '/review'}>Add Review</Link>}
              </Card.Body>
            </Card>
            <br></br>
            <Card>
              <Card.Header as='h5'>Reviews</Card.Header>
              <Card.Body>
                {movie.reviews.map((review, index) => {
                  return (
                    <Card key={index}>
                      <Card.Body>
                        <h5>
                          {review.name + ' reviewed on '} {moment(review.date).format('Do MMMM YYYY')}
                        </h5>
                        <p>{review.review}</p>
                        {props.user && props.user.id === review.user_id && (
                          <Row>
                            <Col>
                              <Link
                                to={{
                                  pathname: '/movies/' + params.id + '/review',
                                  state: { currentReview: review },
                                }}>
                                Edit
                              </Link>
                            </Col>
                            <Col>
                              <Button variant='link' onClick={() => deleteReview(review._id, index)}>
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Movie;
