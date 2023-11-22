/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Spinner } from "react-bootstrap";
import "../styles/Loader.css"; // Assuming you have a CSS file for styles

const Loader = () => {
  return <Spinner animation="border" role="status" className="loader"></Spinner>;
};

export default Loader;

