import React, { Component } from "react";
import { FaGithubAlt, FaPlus } from "react-icons/fa";
import { Container, Form, SubmitButton } from "./styles";

export default class Main extends Component {
  state = {
    newRepo: ""
  };

  handleInputChange = e => {
    console.log(this.state.newRepo);
    this.setState({ newRepo: e.target.value + "a" });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state.newRepo);
  };

  render() {
    const { newRepo } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios {newRepo}
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar respositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton disabled>
            <FaPlus color="#fff" size={14} />
          </SubmitButton>
        </Form>
      </Container>
    );
  }
}
