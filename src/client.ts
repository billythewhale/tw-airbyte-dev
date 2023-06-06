import readline from "readline";
import chalk from "chalk";
import { Connection, Client } from "@temporalio/client";
import { nanoid } from "nanoid";
import { main } from "./workflows";

