import React, { Component } from "react";
import { FaGithubAlt, FaPlus } from "react-icons/fa";

export default class Main extends Component {
  state = {
    newRepo: ""
  };

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
    console.log(this.state.newRepo);
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(11111);
  };

  render() {
    const { newRepo } = this.state;

    return (
      <div>
        <h1>
          <FaGithubAlt />
          Repositórios {newRepo}
        </h1>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar respositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <button type="submit" disabled>
            <FaPlus color="#fff" size={14} />
          </button>
        </form>
      </div>
    );
  }
}
